import { describe, expect, it } from 'vitest'
import { splitDisplayLogic } from './displays'

import testCase1 from './displays__test-01.json'

describe('Split displays, test case 1', () => {
  let items = 0
  const itemizedClassesList = testCase1.map((classType) => {
    const startItem = items
    items += classType.drivers.length

    return {
      ...classType,
      startItem,
    }
  })

  const displayCount = 4
  const itemsPerScreen = Math.ceil(items / displayCount)

  for (const classItem of itemizedClassesList) {
    it.concurrent(`has '${classItem.carClass.class}' on some screen`, () => {
      let contains = false

      for (let screen = 1; screen < displayCount + 1; screen++) {
        const contents = splitDisplayLogic({
          classesList: itemizedClassesList,
          screenIndex: screen,
          itemsPerScreen,
        })

        if (
          contents.some(
            (item) => item.carClass.class == classItem.carClass.class,
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
