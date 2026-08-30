// Run with: yarn tsx shared/src/logic/clubPoints.test.ts
//
// The Tri-Series predicate decides both who scores club points and whether the
// track display gives the club's space over to the speed, so it is worth
// pinning down.

import assert from 'assert'

import { isTriSeriesCompetitor, NON_TRISERIES_CLASS, calculateClubPoints } from './clubPoints.js'

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

const competitor = (klass: string, club?: string, time = 50000) => ({
  number: 1, outright: -1, lastName: 'Test', firstName: 'A',
  class: klass, classIndex: 1, vehicle: 'Car', classRecord: '0.00', club,
  times: [{ run: 1, status: 0, time, split1: 1000, split2: 2000 }],
}) as never

console.log('isTriSeriesCompetitor')

check('an ordinary class is in the series', () =>
  assert.equal(isTriSeriesCompetitor({ class: 'Class A Road - 2WD 0 - 1600cc' }), true),
)
check('the Non TriSeries class is not', () =>
  assert.equal(isTriSeriesCompetitor({ class: NON_TRISERIES_CLASS }), false),
)
check('the match is exact, so a similarly named class still counts', () =>
  assert.equal(isTriSeriesCompetitor({ class: 'Non TriSeries Invitational' }), true),
)

console.log('calculateClubPoints uses the same rule')

check('a Non TriSeries entry scores its club nothing', () => {
  const points = calculateClubPoints([competitor(NON_TRISERIES_CLASS, 'SDMA')])
  assert.deepEqual(points, [])
})
check('an ordinary entry scores its club', () => {
  const points = calculateClubPoints([competitor('Class A', 'SDMA')])
  assert.equal(points.length, 1)
  assert.equal(points[0].club, 'SDMA')
})

console.log(failures === 0 ? '\nAll club points checks passed' : `\n${failures} FAILED`)
process.exit(failures === 0 ? 0 : 1)
