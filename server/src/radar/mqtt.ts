// MQTT client for the radar feed — the preferred source.
//
// The broker publishes one message per completed pass, each carrying its own
// timestamp, which is what makes it the better source: a patchy network delays
// readings rather than losing them, and a reading placed by its timestamp lands
// on the right run however late it turns up (see attribution.ts).
//
// What it cannot do is show a speed climbing live, because a pass is only
// published once it is over. When the broker is unreachable the coordinator in
// source.ts falls back to the WebSocket, which streams samples instead.
//
// The library handles reconnection, so this is deliberately thinner than the
// WebSocket client. Nothing here may throw into the server: an unreachable
// broker is an ordinary state, not an error.

import mqtt, { type MqttClient } from 'mqtt'

import { config } from '../config.js'
import { setupLogger } from '../utils/index.js'
import { parseRadarPassMessage, type RadarPassMessage } from './protocol.js'
import { recordReading } from './store.js'
import { findRunForTimestamp, type AttributedRun } from './attribution.js'

const logger = setupLogger('radar/mqtt')

const CONNECT_TIMEOUT_MS = 10_000
const RECONNECT_PERIOD_MS = 5_000

export interface MqttStatus {
  connected: boolean
  url: string
  topic: string
  lastMessageAt: number | null
  lastError: string | null
}

/** The most recent reading, with the run it was attributed to */
export interface LatestReading {
  reading: RadarPassMessage
  run: AttributedRun | null
  receivedAt: number
}

class RadarMqttClient {
  private client: MqttClient | null = null
  private stopped = true
  private connected = false
  private lastMessageAt: number | null = null
  private lastError: string | null = null
  private everConnected = false
  private failing = false
  private latest: LatestReading | null = null

  public start() {
    if (!config.speedMqttUrl) {
      logger.info('No speedMqttUrl configured, MQTT source disabled')
      return
    }

    this.stopped = false
    logger.info(`MQTT connecting to ${config.speedMqttUrl}, topic ${config.speedMqttTopic}`)

    try {
      const client = mqtt.connect(config.speedMqttUrl, {
        username: config.speedMqttUsername || undefined,
        password: config.speedMqttPassword || undefined,
        // A broker evicts an existing session using the same id, so this must
        // differ from the id the python harness uses
        clientId: config.speedMqttClientId,
        connectTimeout: CONNECT_TIMEOUT_MS,
        reconnectPeriod: RECONNECT_PERIOD_MS,
        clean: true,
      })
      this.client = client

      client.on('connect', () => {
        this.connected = true
        this.lastError = null

        // Subscribing on every connect keeps the subscription across reconnects
        client.subscribe(config.speedMqttTopic, { qos: 1 }, (error) => {
          if (error) {
            this.reportFailure(`MQTT subscribe failed: ${error.message}`)
            return
          }

          if (!this.everConnected || this.failing) {
            logger.info(`MQTT connected: ${config.speedMqttUrl}`)
          } else {
            logger.debug(`MQTT reconnected: ${config.speedMqttUrl}`)
          }
          this.everConnected = true
          this.failing = false
        })
      })

      client.on('message', (topic, payload) =>
        this.handleMessage(topic, payload.toString()),
      )

      client.on('error', (error) => {
        this.lastError = error.message
        this.reportFailure(`MQTT error: ${error.message}`)
      })

      client.on('close', () => {
        if (this.connected) logger.debug('MQTT disconnected')
        this.connected = false
      })
    } catch (error) {
      this.lastError = String(error)
      this.reportFailure(`MQTT connection failed: ${error}`)
    }
  }

  public stop() {
    this.stopped = true
    this.connected = false
    this.failing = false

    try {
      this.client?.end(true)
    } catch {
      // Ending a client that never connected is not interesting
    }

    this.client = null
    this.latest = null
  }

  public restart() {
    this.stop()
    this.start()
  }

  public isConnected() {
    return this.connected
  }

  /** Whether this source is usable at all, so the fallback knows to stand down */
  public isConfigured() {
    return Boolean(config.speedMqttUrl)
  }

  public getStatus(): MqttStatus {
    return {
      connected: this.connected,
      url: config.speedMqttUrl,
      topic: config.speedMqttTopic,
      lastMessageAt: this.lastMessageAt,
      lastError: this.lastError,
    }
  }

  public getLatestReading(): LatestReading | null {
    return this.latest
  }

  private handleMessage(topic: string, payload: string) {
    if (this.stopped) return

    this.lastMessageAt = Date.now()
    logger.debug(`MQTT ${topic}: ${payload.trim()}`)

    const reading = parseRadarPassMessage(payload)
    if (!reading) {
      // Other topics under the wildcard are expected; only pass messages parse
      logger.debug(`Ignoring unparsable message on ${topic}`)
      return
    }

    logger.info(`Radar reading: ${reading.maxSpeed} km/h at ${reading.time}`)

    // Recording and attribution are best-effort: a database or timing-data
    // problem must not stop the feed being consumed
    void this.attributeAndRecord(reading).catch((error) =>
      logger.warn(`Failed to record reading: ${error}`),
    )
  }

  private async attributeAndRecord(reading: RadarPassMessage) {
    await recordReading(reading)

    const run =
      reading.daySecs === null ? null : await findRunForTimestamp(reading.daySecs)

    this.latest = { reading, run, receivedAt: Date.now() }
  }

  /** Warns once per failing streak rather than on every retry */
  private reportFailure(message: string) {
    if (this.failing) {
      logger.debug(message)
      return
    }

    this.failing = true
    logger.warn(message)
  }
}

export const radarMqttClient = new RadarMqttClient()
