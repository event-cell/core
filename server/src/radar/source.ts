// Chooses which radar source is in use.
//
// MQTT is the default: it carries a timestamp per reading, so a patchy network
// delays readings rather than losing them. The WebSocket is the fallback for
// when the broker cannot be reached — it streams live samples but has no
// timestamps, so readings can only be attributed to whatever is on course.
//
// Only one source is live at a time, so a reading is never recorded twice.
//
// The health signal is deliberately the MQTT *connection*, not message silence.
// The broker publishes only when a car passes the trap, so a quiet grid is
// indistinguishable from a healthy idle feed; treating silence as failure would
// flap to the WebSocket every time the track went quiet.

import { config } from '../config.js'
import { setupLogger } from '../utils/index.js'
import { radarClient } from './client.js'
import { radarMqttClient } from './mqtt.js'
import { selectDisplaySpeed } from './protocol.js'
import { getCurrentRun } from './runTracker.js'

const logger = setupLogger('radar/source')

/**
 * How long MQTT may be disconnected before the WebSocket takes over. Long
 * enough to ride out an ordinary reconnect, short enough that a real outage
 * does not cost a whole run.
 */
const FAILOVER_AFTER_MS = 30_000

/** How often the source is reassessed */
const REVIEW_INTERVAL_MS = 5_000

export type SpeedSource = 'mqtt' | 'websocket' | 'none'

let active: SpeedSource = 'none'
let mqttDownSince: number | null = null
let reviewTimer: NodeJS.Timeout | null = null

export function startSpeedSources() {
  if (radarMqttClient.isConfigured()) {
    radarMqttClient.start()
    active = 'mqtt'
  } else {
    logger.info('MQTT not configured; using the WebSocket radar directly')
    radarClient.start()
    active = 'websocket'
  }

  reviewTimer = setInterval(review, REVIEW_INTERVAL_MS)
}

export function stopSpeedSources() {
  if (reviewTimer) clearInterval(reviewTimer)
  reviewTimer = null
  radarMqttClient.stop()
  radarClient.stop()
  active = 'none'
  mqttDownSince = null
}

/** Restarts both sources, for use after the configuration changes */
export function restartSpeedSources() {
  stopSpeedSources()
  startSpeedSources()
}

export function getActiveSource(): SpeedSource {
  return active
}

/**
 * Moves between sources according to whether the broker is reachable.
 *
 * Failing over stops the other source rather than leaving both running, so only
 * one of them is ever recording.
 */
function review() {
  if (!radarMqttClient.isConfigured()) return

  if (radarMqttClient.isConnected()) {
    mqttDownSince = null

    if (active !== 'mqtt') {
      logger.info('MQTT is back; it is the speed source again')
      radarClient.stop()
      active = 'mqtt'
    }
    return
  }

  // Disconnected — start the clock, and hand over once it runs out
  if (mqttDownSince === null) mqttDownSince = Date.now()
  if (active === 'websocket') return

  if (Date.now() - mqttDownSince >= FAILOVER_AFTER_MS) {
    logger.warn(
      `MQTT unreachable for ${Math.round(FAILOVER_AFTER_MS / 1000)}s, ` +
        `falling back to the WebSocket radar at ${config.speedMonitorUrl}`,
    )
    radarClient.start()
    active = 'websocket'
  }
}

/**
 * The speed to show for the run on course, whichever source is live, or null
 * when there is nothing to show.
 *
 * The two sources withhold a stale reading differently. The WebSocket has no
 * timestamps, so a pass counts only if it began after the current run did. MQTT
 * readings are already attributed to a run by timestamp, so the reading simply
 * has to belong to the run on course.
 */
export async function getDisplaySpeed(): Promise<number | null> {
  if (active === 'mqtt') {
    const latest = radarMqttClient.getLatestReading()
    if (!latest?.run) return null

    const run = await getCurrentRun()
    if (!run) return null

    const belongsToCurrentRun =
      latest.run.heat === run.heat && latest.run.car === run.competitor

    return belongsToCurrentRun ? latest.reading.maxSpeed : null
  }

  if (active === 'websocket') {
    return selectDisplaySpeed(radarClient.getCurrentPass(), await getCurrentRun())
  }

  return null
}

export function getSourceStatus() {
  return {
    active,
    mqtt: radarMqttClient.getStatus(),
    websocket: radarClient.getStatus(),
  }
}
