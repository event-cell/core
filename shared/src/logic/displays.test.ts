// Run with: yarn tsx shared/src/logic/displays.test.ts
//
// Covers the class ordering the admin page drives. The packing that follows is
// unchanged; what matters here is that a manual order is honoured and that no
// class can disappear because of a stale or incomplete one.

import assert from 'assert'

import { applyClassOrder, type ClassType } from './displays.js'

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

/** A class of `size` drivers, so only the shape the ordering cares about */
const cls = (classIndex: number, size: number): ClassType => ({
  carClass: { classIndex, class: `Class ${classIndex}` },
  drivers: Array.from({ length: size }, (_, i) => ({ number: classIndex * 100 + i })) as never,
})

const indexes = (list: ClassType[]) => list.map((c) => c.carClass.classIndex)

console.log('applyClassOrder')

check('with no order, falls back to smallest class first', () =>
  assert.deepEqual(indexes(applyClassOrder([cls(1, 9), cls(2, 3), cls(3, 6)])), [2, 3, 1]),
)
check('an empty order behaves exactly as no order', () =>
  assert.deepEqual(indexes(applyClassOrder([cls(1, 9), cls(2, 3)], [])), [2, 1]),
)
check('follows the order the admin arranged', () =>
  assert.deepEqual(indexes(applyClassOrder([cls(1, 9), cls(2, 3), cls(3, 6)], [3, 1, 2])), [3, 1, 2]),
)
check('a partially ordered list keeps the rest, smallest first', () =>
  // only class 3 is placed; 1 and 2 follow automatically
  assert.deepEqual(indexes(applyClassOrder([cls(1, 9), cls(2, 3), cls(3, 6)], [3])), [3, 2, 1]),
)
check('an order naming a class that no longer exists is ignored', () =>
  assert.deepEqual(indexes(applyClassOrder([cls(1, 9), cls(2, 3)], [99, 2, 1])), [2, 1]),
)
check('no class is ever dropped', () => {
  const classes = [cls(1, 9), cls(2, 3), cls(3, 6), cls(4, 1)]
  assert.equal(applyClassOrder(classes, [3]).length, classes.length)
})
check('does not mutate the list it is given', () => {
  const classes = [cls(1, 9), cls(2, 3)]
  applyClassOrder(classes, [2, 1])
  assert.deepEqual(indexes(classes), [1, 2])
})

console.log(failures === 0 ? '\nAll display checks passed' : `\n${failures} FAILED`)
process.exit(failures === 0 ? 0 : 1)
