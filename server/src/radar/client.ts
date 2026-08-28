// Radar speed monitor client: keeps a connection to the radar's speed socket
// and turns the readings into passes. The wire format itself lives in
// protocol.ts.
//
// The socket drops on its own (observed: close code 1006 after ~9 seconds), so
// the connection is treated as disposable and continuously re-established. No
// failure here may propagate: the live timing displays must keep working when
// the radar is unreachable, which is the normal state away from the track.

import { config } from '../config.js'
import { setupLogger } from '../utils/index.js'
import { recordPassSpeed } from './store.js'
import { getCurrentRun } from './runTracker.js'
import {
  getRadarSocketUrl,
  isIdle,
  parseRadarMessage,
  type RadarPass,
} from './protocol.js'

export interface RadarStatus {
  connected: boolean
  url: string
  lastMessageAt: number | null
  lastError: string | null
}

// Re-exported so the router can reach the protocol through one radar entry point
export { getRadarSocketUrl, parseRadarMessage, selectDisplaySpeed } from './protocol.js'
export type { RadarMessage, RadarPass } from './protocol.js'

const logger = setupLogger('radar')

const KEEPALIVE_MS = 25_000
const RECONNECT_MIN_MS = 1_000
const RECONNECT_MAX_MS = 30_000
// A connection attempt can hang without ever firing open, error or close —
// observed against the radar — which would otherwise end the retry chain
const CONNECT_TIMEOUT_MS = 10_000
// The radar emits continuously, idle included, so prolonged silence means a
// half-open socket rather than a quiet track
const RECEIVE_TIMEOUT_MS = 120_000

class RadarClient {
  private socket: WebSocket | null = null
  private keepaliveTimer: NodeJS.Timeout | null = null
  private reconnectTimer: NodeJS.Timeout | null = null
  private watchdogTimer: NodeJS.Timeout | null = null
  private reconnectDelay = RECONNECT_MIN_MS
  private stopped = true

  private url = ''
  private connected = false
  private lastMessageAt: number | null = null
  private lastError: string | null = null
  /** Whether the radar has ever been reachable, and whether it is failing now */
  private everConnected = false
  private failing = false

  private pass: RadarPass | null = null
  private passSeq = 0
  private lastN = 0

  public start() {
    this.stopped = false

    try {
      this.url = getRadarSocketUrl(config.speedMonitorUrl)
    } catch (error) {
      this.lastError = `Invalid speedMonitorUrl: ${config.speedMonitorUrl}`
      logger.warn(`${this.lastError} (${error})`)
      return
    }

    logger.info(`Radar client starting, socket ${this.url}`)
    this.connect()
  }

  public stop() {
    this.stopped = true
    this.clearTimers()

    try {
      this.socket?.close()
    } catch {
      // Closing a socket that never opened is not interesting
    }

    this.socket = null
    this.connected = false
    this.failing = false
    this.pass = null
    this.lastN = 0
  }

  /** Reconnects with the current configuration, for use after a config change */
  public restart() {
    this.stop()
    this.start()
  }

  public getStatus(): RadarStatus {
    return {
      connected: this.connected,
      url: this.url,
      lastMessageAt: this.lastMessageAt,
      lastError: this.lastError,
    }
  }

  public getCurrentPass(): RadarPass | null {
    return this.pass
  }

  private connect() {
    if (this.stopped) return

    try {
      logger.debug(`Radar connecting to ${this.url}`)
      const socket = new WebSocket(this.url)
      this.socket = socket

      // Abandons an attempt that neither opens nor fails
      this.watchdogTimer = setTimeout(() => {
        if (this.socket !== socket || this.connected) return
        this.lastError = `Connection timed out: ${this.url}`
        this.reportFailure(`Radar connection timed out after ${CONNECT_TIMEOUT_MS}ms`)
        this.abandon(socket)
      }, CONNECT_TIMEOUT_MS)

      socket.onopen = () => {
        if (this.socket !== socket) return
        this.connected = true
        this.lastError = null
        this.reconnectDelay = RECONNECT_MIN_MS

        // The radar drops the socket every few seconds by design, so routine
        // reconnects are debug-level. Only a change in whether the radar is
        // usable at all is worth an info line.
        if (!this.everConnected || this.failing) {
          logger.info(`Radar connected: ${this.url}`)
        } else {
          logger.debug(`Radar reconnected: ${this.url}`)
        }

        this.everConnected = true
        this.failing = false
        this.startKeepalive()
        this.armReceiveWatchdog(socket)
      }

      socket.onmessage = (event) => {
        if (this.socket !== socket) return
        this.armReceiveWatchdog(socket)
        this.handleMessage(String(event.data))
      }

      socket.onerror = () => {
        // The close handler does the reconnecting; an error without a close
        // still leaves the socket unusable, so only the reason is recorded.
        if (this.socket !== socket) return
        this.lastError = `Connection error: ${this.url}`
      }

      socket.onclose = (event) => {
        // A late event from a socket already replaced must not disturb the
        // connection that superseded it
        if (this.socket !== socket) return
        if (this.connected) logger.debug(`Radar disconnected (code ${event.code})`)
        this.connected = false
        this.scheduleReconnect()
      }
    } catch (error) {
      this.lastError = String(error)
      this.reportFailure(`Radar connection failed: ${error}`)
      this.scheduleReconnect()
    }
  }

  /**
   * Warns once per failing streak. A radar that is switched off would otherwise
   * warn on every retry for the length of the event.
   */
  private reportFailure(message: string) {
    if (this.failing) {
      logger.debug(message)
      return
    }

    this.failing = true
    logger.warn(message)
  }

  /** Drops a socket that has stopped behaving and starts a fresh attempt */
  private abandon(socket: WebSocket) {
    this.socket = null
    this.connected = false

    try {
      socket.close()
    } catch {
      // A hung socket may refuse to close cleanly; it is being discarded anyway
    }

    this.scheduleReconnect()
  }

  /** Recycles a connection that has gone silent, which means it is half-open */
  private armReceiveWatchdog(socket: WebSocket) {
    if (this.watchdogTimer) clearTimeout(this.watchdogTimer)

    this.watchdogTimer = setTimeout(() => {
      if (this.socket !== socket) return
      this.lastError = `No data for ${RECEIVE_TIMEOUT_MS}ms: ${this.url}`
      this.reportFailure(`Radar silent for ${RECEIVE_TIMEOUT_MS}ms, reconnecting`)
      this.abandon(socket)
    }, RECEIVE_TIMEOUT_MS)
  }

  private startKeepalive() {
    this.clearKeepalive()
    this.keepaliveTimer = setInterval(() => {
      try {
        if (this.socket?.readyState === 1) this.socket.send('\n')
      } catch (error) {
        logger.debug(`Radar keepalive failed: ${error}`)
      }
    }, KEEPALIVE_MS)
  }

  private scheduleReconnect() {
    this.clearTimers()
    if (this.stopped) return

    const delay = this.reconnectDelay
    this.reconnectDelay = Math.min(delay * 2, RECONNECT_MAX_MS)

    logger.debug(`Radar reconnecting in ${delay}ms`)
    this.reconnectTimer = setTimeout(() => this.connect(), delay)
  }

  private clearKeepalive() {
    if (this.keepaliveTimer) clearInterval(this.keepaliveTimer)
    this.keepaliveTimer = null
  }

  private clearTimers() {
    this.clearKeepalive()
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.reconnectTimer = null
    if (this.watchdogTimer) clearTimeout(this.watchdogTimer)
    this.watchdogTimer = null
  }

  private handleMessage(data: string) {
    const message = parseRadarMessage(data)
    if (!message) return

    this.lastMessageAt = Date.now()
    logger.debug(`Radar: ${data.trim()}`)

    if (isIdle(message)) {
      this.endPass()
      this.lastN = 0
      return
    }

    // A new pass starts when the radar's record counter restarts. Within a
    // pass N climbs, so a drop (or a move away from zero) marks a new car.
    if (message.N < this.lastN || this.lastN === 0) this.startPass()
    this.lastN = message.N

    if (this.pass) this.pass.maxSpeed = Math.max(this.pass.maxSpeed, message.M)
  }

  private startPass() {
    this.endPass()
    this.passSeq += 1

    const pass: RadarPass = {
      passSeq: this.passSeq,
      startedAt: Date.now(),
      maxSpeed: 0,
      run: null,
    }
    this.pass = pass
    logger.info(`Radar pass ${this.passSeq} started`)

    // Attributed at the start of the pass, so a run change part way through
    // cannot reassign the speed to the next car
    void getCurrentRun()
      .then((run) => {
        pass.run = run
      })
      .catch((error) => logger.warn(`Failed to attribute pass: ${error}`))
  }

  private endPass() {
    const pass = this.pass
    this.pass = null
    if (!pass || pass.maxSpeed <= 0) return

    logger.info(`Radar pass ${pass.passSeq} ended, max ${pass.maxSpeed} km/h`)

    // Persisting is best-effort: history is never worth breaking the live feed for
    void recordPassSpeed(pass).catch((error) =>
      logger.warn(`Failed to record pass speed: ${error}`),
    )
  }
}

export const radarClient = new RadarClient()
