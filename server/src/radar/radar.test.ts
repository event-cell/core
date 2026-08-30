// Run with: yarn tsx src/radar/radar.test.ts
//
// Covers the two pieces of radar handling that are easy to get wrong and hard
// to observe at an event: parsing the wire format, and deciding when a speed
// belongs to the run currently on course.

import assert from 'assert'

import {
  getRadarSocketUrl,
  parseRadarMessage,
  parseRadarPassMessage,
  selectDisplaySpeed,
  type RadarPass,
} from './protocol.js'
import type { CurrentRun } from './runTracker.js'
import { chooseRun, MICROS_PER_SECOND } from './attribution.js'

let failures = 0
const check = (name: string, fn: () => void) => {
  try {
    fn()
    console.log(`  ok   ${name}`)
  } catch (error) {
    failures++
    console.log(`  FAIL ${name}\n       ${error}`)
  }
}

console.log('getRadarSocketUrl')
check('derives the socket from the monitor page host', () =>
  assert.equal(
    getRadarSocketUrl('http://radar1.local/radar/two.html'),
    'ws://radar1.local/ws/radar1-slow/',
  ),
)
check('tolerates the doubled slash of the test URL', () =>
  assert.equal(
    getRadarSocketUrl('http://www.dd.id.au//radar/two.html'),
    'ws://www.dd.id.au/ws/radar1-slow/',
  ),
)
check('keeps a port', () =>
  assert.equal(
    getRadarSocketUrl('http://radar1.local:8080/radar/two.html'),
    'ws://radar1.local:8080/ws/radar1-slow/',
  ),
)
check('upgrades https to wss', () =>
  assert.equal(
    getRadarSocketUrl('https://radar1.local/radar/two.html'),
    'wss://radar1.local/ws/radar1-slow/',
  ),
)
check('passes an explicit socket URL through', () =>
  assert.equal(
    getRadarSocketUrl('ws://radar1.local/ws/radar1-fast/'),
    'ws://radar1.local/ws/radar1-fast/',
  ),
)

console.log('parseRadarMessage')
check('parses a live reading', () =>
  assert.deepEqual(parseRadarMessage('S39.6 M115.0 C39.6 N77 T155 P0.0\n'), {
    S: 39.6,
    M: 115,
    C: 39.6,
    N: 77,
    T: 155,
    P: 0,
  }),
)
check('parses the idle reading', () =>
  assert.deepEqual(parseRadarMessage('S0.0 M0.0 C0.0 N0 T0 P0.0\n'), {
    S: 0,
    M: 0,
    C: 0,
    N: 0,
    T: 0,
    P: 0,
  }),
)
check('ignores unknown fields rather than failing', () =>
  assert.equal(parseRadarMessage('S12.0 X99 M20.0')?.M, 20),
)
check('returns null for a keepalive newline', () =>
  assert.equal(parseRadarMessage('\n'), null),
)
check('returns null for junk', () =>
  assert.equal(parseRadarMessage('hello world'), null),
)

console.log('parseRadarPassMessage')
check('parses a pass message', () =>
  assert.deepEqual(parseRadarPassMessage('Time: 1787900000 MaxSpeed: 118.4 Day_secs: 45123'), {
    time: 1787900000,
    maxSpeed: 118.4,
    daySecs: 45123,
  }),
)
check('reads fields by label, not position', () =>
  assert.deepEqual(
    parseRadarPassMessage('Day_secs: 45123 Extra: 9 Time: 1787900000 MaxSpeed: 118.4'),
    { time: 1787900000, maxSpeed: 118.4, daySecs: 45123 },
  ),
)
check('tolerates a message with no Day_secs', () =>
  assert.equal(parseRadarPassMessage('Time: 1787900000 MaxSpeed: 118.4')?.daySecs, null),
)
check('rejects a message missing MaxSpeed', () =>
  assert.equal(parseRadarPassMessage('Time: 1787900000 Day_secs: 45123'), null),
)
check('rejects a zero speed', () =>
  assert.equal(parseRadarPassMessage('Time: 1787900000 MaxSpeed: 0.0'), null),
)
check('rejects junk', () => assert.equal(parseRadarPassMessage('hello world'), null))

console.log('selectDisplaySpeed')
const run = (changedAt: number): CurrentRun => ({
  heat: 1,
  competitor: 42,
  runKey: '1:42',
  changedAt,
})
const pass = (startedAt: number, maxSpeed: number): RadarPass => ({
  passSeq: 1,
  startedAt,
  maxSpeed,
  run: null,
})

check('shows a pass that started after the run did', () =>
  assert.equal(selectDisplaySpeed(pass(2000, 118.4), run(1000)), 118.4),
)
check('withholds a pass from before the run started', () =>
  assert.equal(selectDisplaySpeed(pass(1000, 118.4), run(2000)), null),
)
check('withholds when there is no pass', () =>
  assert.equal(selectDisplaySpeed(null, run(1000)), null),
)
check('withholds a pass that has recorded no speed yet', () =>
  assert.equal(selectDisplaySpeed(pass(2000, 0), run(1000)), null),
)
check('shows the pass when the run is unknown', () =>
  assert.equal(selectDisplaySpeed(pass(2000, 99.5), null), 99.5),
)
check('shows a pass under way when the run was only just observed', () =>
  // runTracker stamps a first observation with 0 rather than now: the run did
  // not change, so a pass already under way must not be withheld
  assert.equal(selectDisplaySpeed(pass(2000, 118.4), run(0)), 118.4),
)

console.log('chooseRun (attribution by timestamp)')
const S = MICROS_PER_SECOND
// a car that crossed the first split at 100s and finished at 160s
const running = (heat: number, car: number, inter: number, finish: number | null) => ({
  heat, car, interMicros: inter * S, finishMicros: finish === null ? null : finish * S,
})

check('places a reading inside the run it falls in', () =>
  assert.deepEqual(chooseRun([running(1, 42, 100, 160)], 120 * S), { heat: 1, car: 42 }),
)
check('prefers the run that started most recently before the reading', () =>
  assert.deepEqual(
    chooseRun([running(1, 42, 100, 160), running(2, 7, 140, 200)], 150 * S),
    { heat: 2, car: 7 },
  ),
)
check('ignores a run that had already finished', () =>
  assert.equal(chooseRun([running(1, 42, 100, 130)], 150 * S), null),
)
check('ignores a run that had not started', () =>
  assert.equal(chooseRun([running(1, 42, 200, 260)], 150 * S), null),
)
check('accepts a run still under way with no finish recorded', () =>
  assert.deepEqual(chooseRun([running(1, 42, 100, null)], 150 * S), { heat: 1, car: 42 }),
)
check('rejects an unfinished run older than a plausible run length', () =>
  assert.equal(chooseRun([running(1, 42, 100, null)], 500 * S), null),
)
check('rejects a run longer than a plausible run length', () =>
  assert.equal(chooseRun([running(1, 42, 100, 900)], 500 * S), null),
)
check('returns null when nothing was on course', () =>
  assert.equal(chooseRun([], 150 * S), null),
)
check('places a late message on the run it belonged to, not the latest one', () => {
  // the reading is from 120s; a later run has since started and finished
  const candidates = [running(1, 42, 100, 160), running(2, 7, 300, 360)]
  assert.deepEqual(chooseRun(candidates, 120 * S), { heat: 1, car: 42 })
})

console.log(failures === 0 ? '\nAll radar checks passed' : `\n${failures} FAILED`)
process.exit(failures === 0 ? 0 : 1)
