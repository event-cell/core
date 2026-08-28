// Persistence for radar speeds.
//
// Speeds live in Speeds.db alongside the event databases, in the schema that
// was already in use before the server took ownership of writing it:
//
//   speeds(event, time_t, speed)          every pass, attributed or not
//   car_speeds(event, heat, car, speed)   best speed per competitor per heat
//
// Speeds are integers in tenths of a km/h (1273 = 127.3 km/h) and `event` is the
// numeric event id. Existing history therefore stays readable, and the displays
// can show speeds from events that predate this code.
//
// Every operation here is best-effort. A missing or unwritable database degrades
// to "no speed history" and must never interfere with the live displays.

import { existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'

import { PrismaClient as pcSpeeds } from '../prisma/generated/speeds/index.js'
import { config } from '../config.js'
import { setupLogger } from '../utils/index.js'
import type { RadarPass } from './protocol.js'
import { getCurrentRun } from './runTracker.js'

const logger = setupLogger('radar/store')

/** How long to wait before trying a failed database again */
const RETRY_AFTER_MS = 60_000

let client: pcSpeeds | null = null
let initialised = false
let lastFailureAt = 0
let failureLogged = false

/** The wire format is km/h to one decimal; the database stores tenths */
export const toTenths = (kmh: number) => Math.round(kmh * 10)

/**
 * Event ids are strings in config ("097") but integers in Speeds.db (97).
 * Returns null when the id is not numeric, so nothing is filed under a wrong id.
 */
export function parseEventId(eventId: string): number | null {
  const value = Number.parseInt(eventId, 10)
  return Number.isFinite(value) ? value : null
}

/**
 * Opens Speeds.db, creating it if it is not there yet.
 *
 * Prisma has no migration step in the container, and the schema is only used to
 * generate the typed client, so the tables are created with the same DDL the
 * existing file uses — `IF NOT EXISTS`, so an existing database is untouched.
 */
async function getClient(): Promise<pcSpeeds | null> {
  if (initialised && client) return client

  // A failure is not permanent: the mount may not be ready when the container
  // starts, and giving up for good would cost the whole event's speeds
  if (lastFailureAt && Date.now() - lastFailureAt < RETRY_AFTER_MS) return null

  try {
    const databaseFile = config.speedDatabasePath
    const directory = dirname(databaseFile)

    if (!existsSync(directory)) {
      // Deliberately not `recursive: true`: that spins forever on a path the
      // kernel refuses to create under (verified against /proc), which would
      // hang the event loop and take every display down with it. One level is
      // enough — the parent is an existing mount in every deployment — and it
      // fails fast with ENOENT when the path is wrong.
      mkdirSync(directory)
      logger.info(`Created speed database directory: ${directory}`)
    }

    client = new pcSpeeds({
      datasources: { db: { url: `file:${databaseFile}` } },
    })

    await client.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS speeds ( event INT NOT NULL, time_t INT NOT NULL, speed INT NOT NULL, CONSTRAINT Tuple UNIQUE (event, time_t, speed))`,
    )
    await client.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS car_speeds ( event INT NOT NULL, heat INT NOT NULL, car INT NOT NULL, speed INT NOT NULL, CONSTRAINT Tuple UNIQUE (event, heat, car, speed))`,
    )

    initialised = true
    lastFailureAt = 0
    failureLogged = false
    logger.info(`Speed database ready: ${databaseFile}`)
    return client
  } catch (error) {
    // Logged once per outage rather than once per pass, so a database that stays
    // missing does not fill the log
    if (!failureLogged) {
      logger.warn(
        `Speed database unavailable, speeds will not be recorded ` +
          `(retrying every ${RETRY_AFTER_MS / 1000}s): ${error}`,
      )
      failureLogged = true
    }

    void client?.$disconnect().catch(() => undefined)
    client = null
    lastFailureAt = Date.now()
    return null
  }
}

/** Reopens the database, for use after the configured path changes */
export function resetStore() {
  void client?.$disconnect().catch(() => undefined)
  client = null
  initialised = false
  lastFailureAt = 0
  failureLogged = false
}

/** Closes the database, for use on shutdown */
export async function closeStore() {
  const open = client
  client = null
  initialised = false
  await open?.$disconnect().catch(() => undefined)
}

/**
 * Records a completed pass: always in `speeds`, and in `car_speeds` when it can
 * be attributed to a competitor's run.
 *
 * `car_speeds` keeps one row per competitor per heat holding their best speed.
 * The table's unique constraint spans the speed as well, so inserting blindly
 * would accumulate a row per pass — the existing file has one such pair.
 */
export async function recordPassSpeed(pass: RadarPass): Promise<void> {
  const db = await getClient()
  if (!db) return

  const run = pass.run ?? (await getCurrentRun())
  const speed = toTenths(pass.maxSpeed)
  const eventId = parseEventId(config.eventId)

  if (eventId === null) {
    logger.warn(`Event id ${config.eventId} is not numeric, not recording speed`)
    return
  }

  // The raw log keeps every pass, even one that cannot be tied to a car
  await db.$executeRaw`
    INSERT OR IGNORE INTO speeds (event, time_t, speed)
    VALUES (${eventId}, ${Math.floor(pass.startedAt / 1000)}, ${speed})
  `

  if (!run) {
    logger.warn(`Pass ${pass.passSeq} has no run to attribute its speed to`)
    return
  }

  const existing = await db.$queryRaw<{ speed: bigint | number | null }[]>`
    SELECT MAX(speed) AS speed FROM car_speeds
    WHERE event = ${eventId} AND heat = ${run.heat} AND car = ${run.competitor}
  `
  // SQLite INTEGER columns come back from a raw query as BigInt, which cannot be
  // compared with or divided by a Number without an explicit conversion
  const existingSpeed = existing[0]?.speed
  const best = existingSpeed == null ? null : Number(existingSpeed)

  if (best === null) {
    await db.$executeRaw`
      INSERT INTO car_speeds (event, heat, car, speed)
      VALUES (${eventId}, ${run.heat}, ${run.competitor}, ${speed})
    `
  } else if (speed > best) {
    await db.$executeRaw`
      UPDATE car_speeds SET speed = ${speed}
      WHERE event = ${eventId} AND heat = ${run.heat} AND car = ${run.competitor}
    `
  } else {
    logger.info(
      `Pass ${pass.passSeq} (${pass.maxSpeed} km/h) not faster than the recorded ` +
        `${best / 10} km/h for heat ${run.heat} car ${run.competitor}`,
    )
    return
  }

  logger.info(
    `Recorded ${pass.maxSpeed} km/h for event ${eventId} heat ${run.heat} car ${run.competitor}`,
  )
}

/**
 * Best speed per competitor for an event, keyed `heat:car`, in km/h.
 *
 * MAX() rather than the raw value because the legacy rows can hold more than one
 * speed for a car.
 */
export async function getEventSpeeds(
  eventId: string,
): Promise<Record<string, number>> {
  const db = await getClient()
  const event = parseEventId(eventId)
  if (!db || event === null) return {}

  try {
    const rows = await db.$queryRaw<
      { heat: bigint | number; car: bigint | number; speed: bigint | number }[]
    >`
      SELECT heat, car, MAX(speed) AS speed FROM car_speeds
      WHERE event = ${event}
      GROUP BY heat, car
    `

    // Raw SQLite integers arrive as BigInt — see recordPassSpeed
    return Object.fromEntries(
      rows.map((row) => [
        `${Number(row.heat)}:${Number(row.car)}`,
        Number(row.speed) / 10,
      ]),
    )
  } catch (error) {
    logger.warn(`Failed to read speed history: ${error}`)
    return {}
  }
}
