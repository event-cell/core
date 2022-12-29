import { describe, expect, it } from 'vitest'
import { splitDisplayLogic } from './display'

import testCase1 from './display/test_case_1.json'

describe('Split displays, test case 1', () => {
  const displayCount = 4
  const itemsPerScreen = Math.ceil(testCase1.length / displayCount)

  for (const classItem of testCase1) {
    it.concurrent(`has '${classItem.carClass.class}' on some screen`, () => {
      let contains = false

      for (let screen = 1; screen < displayCount + 1; screen++) {
        const contents = splitDisplayLogic({
          classesList: testCase1,
          screenIndex: screen,
          itemsPerScreen,
        })

        if (
          contents.some(
            (item) => item.carClass.class == classItem.carClass.class
          )
        ) {
          contains = true
          break
        }
      }

      expect(contains).toBeTruthy()
    })
  }
})
