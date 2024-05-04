import { describe, expect, it } from 'vitest'
import { BestSectorTimes, getPersonalBestSectors } from './functions'

const exampleCompetitor = {
  number: 32,
  firstName: 'John',
  lastName: 'Smith',
  vehicle: 'unknonwn',

  class: 'Class',
  classIndex: 0,
  classRecord: 'unknonwn',
}

describe('getPersonalBestSectors', () => {
  it('Functions', () =>
    expect(
      getPersonalBestSectors({
        ...exampleCompetitor,
        times: [
          { run: 0, status: 1, time: 28, split1: 10, split2: 18 },
          { run: 0, status: 1, time: 32, split1: 9, split2: 20 },
          { run: 0, status: 1, time: 30, split1: 7, split2: 21 },
        ],
      }),
    ).toStrictEqual({
      bestSector1: 7,
      bestSector2: 8,
      bestSector3: 9,

      previousBestSector1: 9,
      previousBestSector2: 11,
      previousBestSector3: 10,
    } satisfies BestSectorTimes))
})
