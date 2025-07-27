import { CompetitorList } from 'server/src/router/objects.js'

export interface ClassType {
  drivers: CompetitorList
  carClass: { classIndex: number; class: string }
}

export const getDisplayNumber = (): number => {
  if (
    typeof window === 'undefined' ||
    window.location.pathname === '/display' ||
    !window.location.pathname.includes('/display/') ||
    window.location.pathname.split('/')[1].includes('-')
  )
    return 0

  return Number(window.location.pathname.replace('/display/', ''))
}

export type ItemizedClassType = ClassType & { startItem: number }

/**
 * This is the internal logic of the {@link splitDisplay} function. It is here
 * to make it easier to test
 */
export const splitDisplayLogic = ({
  classesList,
  screenIndex,
  itemsPerScreen,
}: {
  classesList: ItemizedClassType[]
  screenIndex: number
  itemsPerScreen: number
}): ItemizedClassType[] =>
  classesList.filter(
    (classInfo) =>
      // If the class was not on the last screen
      classInfo.startItem >= (screenIndex - 1) * itemsPerScreen &&
      // If the class is not large enough to be on the next screen
      classInfo.startItem < screenIndex * itemsPerScreen,
  )

export function splitDisplay(classesList: ClassType[]) {
  if (
    typeof window == 'undefined' ||
    window.location.pathname === '/display' ||
    !window.location.pathname.includes('/display/') ||
    window.location.pathname.split('/')[1].includes('-')
  )
    return classesList

  let items = 0
  const itemizedClassesList: ItemizedClassType[] = classesList.map(
    (classType) => {
      const startItem = items
      items += classType.drivers.length

      return {
        ...classType,
        startItem,
      } satisfies ItemizedClassType
    },
  )

  // Calculate ClassesList for each screen.
  const numberOfScreens = 4 // TODO: This should be configurable
  const itemsPerScreen = Math.ceil(items / numberOfScreens)

  try {
    const screenIndex = Number.parseInt(
      window.location.pathname.replace('/display/', ''),
    )

    return splitDisplayLogic({
      classesList: itemizedClassesList,
      screenIndex,
      itemsPerScreen,
    })
  } catch (e) {
    console.warn(
      'Failed to generate classList for this display. Falling back to the full list',
    )
    console.warn(e)

    return classesList
  }
}
