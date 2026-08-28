// The radar's wire format and the rules for interpreting it.
//
// Kept free of connection, config and database imports so it can be reasoned
// about — and tested — on its own. See client.ts for the socket handling.
//
//   S0.0 M0.0 C0.0 N0 T0 P0.0        idle — every field zero
//   S39.6 M115.0 C39.6 N77 T155 P0.0 in a pass — M is the running max
//
//   S  current speed        N  record number within this pass
//   M  max speed this pass  T  time
//   C  corner speed (unusable — too much cosine effect, ignored)
//   P  previous pass max

import type { CurrentRun } from './runTracker.js'

export interface RadarMessage {
  S: number
  M: number
  C: number
  N: number
  T: number
  P: number
}

export interface RadarPass {
  /** Increments once per detected pass, so callers can tell passes apart */
  passSeq: number
  startedAt: number
  maxSpeed: number
  /**
   * The run on course when the pass began. The speed trap sits after the first
   * split, so by then the timing system already reports the car as current.
   */
  run: CurrentRun | null
}

/**
 * Derives the speed WebSocket from the configured monitor URL.
 *
 * The radar's own page builds its socket as `ws://<its own host>/ws/radar1-slow/`,
 * so the host of the configured page URL is what matters. A `ws://` or `wss://`
 * value is used verbatim, which allows the path to be overridden through config
 * without a schema change.
 */
export function getRadarSocketUrl(monitorUrl: string): string {
  const url = new URL(monitorUrl)

  if (url.protocol === 'ws:' || url.protocol === 'wss:') return monitorUrl

  const scheme = url.protocol === 'https:' ? 'wss' : 'ws'
  return `${scheme}://${url.host}/ws/radar1-slow/`
}

/**
 * Parses a radar line into its fields. Tokens are identified by their leading
 * letter, and unknown letters are ignored so extra fields cannot break parsing.
 * Returns null when the line contains nothing recognisable — a keepalive
 * newline, for instance.
 */
export function parseRadarMessage(line: string): RadarMessage | null {
  const message: RadarMessage = { S: 0, M: 0, C: 0, N: 0, T: 0, P: 0 }
  let matched = false

  for (const token of line.trim().split(/\s+/)) {
    const key = token.substring(0, 1)
    if (!(key in message)) continue

    const value = Number(token.substring(1))
    if (!Number.isFinite(value)) continue

    message[key as keyof RadarMessage] = value
    matched = true
  }

  return matched ? message : null
}

/** Between passes the radar reports zeroes */
export const isIdle = (m: RadarMessage) => m.S === 0 && m.M === 0 && m.N === 0

/**
 * Decides the speed to show for the run currently on course, or null when there
 * is nothing to show.
 *
 * The radar keeps reporting the last pass it saw, so a car that has started a
 * run but not yet reached the speed trap would otherwise inherit the previous
 * car's speed. A pass therefore only counts once it started after the current
 * run did — the trap sits beyond the first split, so every genuine reading for a
 * run arrives well after that run began.
 */
export function selectDisplaySpeed(
  pass: RadarPass | null,
  run: CurrentRun | null,
): number | null {
  if (!pass || pass.maxSpeed <= 0) return null
  if (run && pass.startedAt < run.changedAt) return null

  return pass.maxSpeed
}
