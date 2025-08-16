import { CompetitorList } from 'server/src/router/objects.js'
import { displayConfigService } from '../services/displayConfig.js'

export interface ClassType {
  drivers: CompetitorList
  carClass: { classIndex: number; class: string }
}

export interface DisplayDistributionConfig {
  maxRowsPerDisplay: number
}

export const DEFAULT_DISPLAY_CONFIG: DisplayDistributionConfig = {
  maxRowsPerDisplay: 20,
}

export const getDisplayNumber = (): number => {
  if (
    typeof window === 'undefined' ||
    window.location.pathname === '/display' ||
    !window.location.pathname.includes('/display/') ||
    window.location.pathname.split('/')[1].includes('-')
  ) return 0

  return Number(window.location.pathname.replace('/display/', ''))
}

export type ItemizedClassType = ClassType & { startItem: number }

/**
 * Groups a flat competitor list into class groupings
 */
export const groupByClass = (drivers: CompetitorList): ClassType[] => {
  const classMap = new Map<number, ClassType>()

  for (const driver of drivers) {
    const key = driver.classIndex
    if (!classMap.has(key)) {
      classMap.set(key, {
        carClass: { classIndex: driver.classIndex, class: driver.class },
        drivers: [],
      })
    }
    classMap.get(key)!.drivers.push(driver)
  }

  return [...classMap.values()]
}

/**
 * Optimizes class distribution to maximize usage of displays 1-3
 */
export const optimizeClassDistribution = (
  classesList: ClassType[],
  config: DisplayDistributionConfig = DEFAULT_DISPLAY_CONFIG
): ItemizedClassType[] => {
  if (!Array.isArray(classesList) || classesList.length === 0) {
    console.warn('optimizeClassDistribution received empty or invalid class list')
    return []
  }

  // Sort classes from smallest to largest, then by classIndex for predictable order
  const sortedClasses = [...classesList].map(cls => ({
    drivers: [...cls.drivers],
    carClass: { ...cls.carClass },
  })).sort((a, b) => {
    // First sort by class size (smallest to largest)
    const sizeDiff = a.drivers.length - b.drivers.length
    if (sizeDiff !== 0) return sizeDiff

    // Then sort by classIndex for predictable order
    return a.carClass.classIndex - b.carClass.classIndex
  })

  let currentItems = 0
  const optimizedClasses: ItemizedClassType[] = []

  for (const classType of sortedClasses) {
    optimizedClasses.push({
      ...classType,
      startItem: currentItems,
    })
    currentItems += classType.drivers.length
  }

  return optimizedClasses
}

export const analyzeDistribution = (classesList: ClassType[]) => {
  const totalClasses = classesList.length
  const totalItems = classesList.reduce((sum, cls) => sum + cls.drivers.length, 0)
  const itemsPerDisplay = Math.ceil(totalItems / 4)

  const classSizes = classesList.map(cls => ({
    classIndex: cls.carClass.classIndex,
    className: cls.carClass.class,
    size: cls.drivers.length,
  })).sort((a, b) => b.size - a.size)

  return {
    totalClasses,
    totalItems,
    classSizes,
    estimatedDisplayDistribution: [
      { display: 1, estimatedItems: itemsPerDisplay },
      { display: 2, estimatedItems: itemsPerDisplay },
      { display: 3, estimatedItems: itemsPerDisplay },
      { display: 4, estimatedItems: totalItems - (itemsPerDisplay * 3) },
    ],
  }
}

export const getDisplayStats = (classesList: ClassType[], displayNumber: number) => {
  const optimized = optimizeClassDistribution(classesList)
  const totalItems = optimized.reduce((sum, cls) => sum + cls.drivers.length, 0)
  const itemsPerScreen = Math.ceil(totalItems / 4)

  const displayClasses = splitDisplayLogic({
    classesList: optimized,
    screenIndex: displayNumber,
    itemsPerScreen,
  })

  return {
    displayNumber,
    classesOnDisplay: displayClasses.length,
    itemsOnDisplay: displayClasses.reduce((sum, cls) => sum + cls.drivers.length, 0),
    classes: displayClasses.map(cls => ({
      className: cls.carClass.class,
      itemCount: cls.drivers.length,
    })),
  }
}

export const splitDisplayLogic = ({
  classesList,
  screenIndex,
  itemsPerScreen,
}: {
  classesList: ItemizedClassType[]
  screenIndex: number
  itemsPerScreen: number
}): ItemizedClassType[] =>
  classesList.filter(cls => {
    const start = cls.startItem
    const end = start + cls.drivers.length - 1
    const screenStart = (screenIndex - 1) * itemsPerScreen
    const screenEnd = screenIndex * itemsPerScreen - 1
    return start <= screenEnd && end >= screenStart
  })

// Cache to prevent multiple distributions
let lastDistribution: {
  classes: ClassType[];
  config: DisplayDistributionConfig;
  result: ItemizedClassType[];
  pathname: string;
} | null = null

export async function splitDisplay(classesList: ClassType[], config?: DisplayDistributionConfig) {
  if (
    typeof window === 'undefined' ||
    window.location.pathname === '/display' ||
    window.location.pathname === 'display' ||
    (!window.location.pathname.includes('/display/') && !window.location.pathname.includes('display/')) ||
    window.location.pathname.split('/')[1]?.includes('-')
  ) {
    return classesList
  }

  if (!Array.isArray(classesList) || !classesList.every(cls => Array.isArray(cls.drivers))) {
    console.warn('splitDisplay received invalid input — expected ClassType[] with drivers[]')
    return []
  }

  // Get config from service if not provided
  let displayConfig: DisplayDistributionConfig
  if (config && config.maxRowsPerDisplay !== undefined) {
    displayConfig = config
  } else {
    try {
      displayConfig = await displayConfigService.getDisplayDistributionConfig()
    } catch (error) {
      console.warn('splitDisplay - failed to load config, using defaults:', error)
      displayConfig = DEFAULT_DISPLAY_CONFIG
    }
  }

  const currentPathname = typeof window !== 'undefined' ? window.location.pathname : 'server'

  // Check if we can use cached result
  if (lastDistribution &&
    lastDistribution.pathname === currentPathname &&
    lastDistribution.classes.length === classesList.length &&
    lastDistribution.classes.every((cls, i) =>
      cls.carClass.classIndex === classesList[i].carClass.classIndex &&
      cls.drivers.length === classesList[i].drivers.length
    ) &&
    lastDistribution.config.maxRowsPerDisplay === displayConfig.maxRowsPerDisplay) {
    const screenIndex = Number.parseInt(window.location.pathname.replace(/^\/?display\//, ''))
    return getOptimizedDisplayClasses(lastDistribution.result, screenIndex, displayConfig)
  }

  // Perform new distribution
  const optimized = optimizeClassDistribution(classesList, displayConfig)

  // Cache the result
  lastDistribution = {
    classes: classesList,
    config: displayConfig,
    result: optimized,
    pathname: currentPathname
  }

  try {
    const screenIndex = Number.parseInt(window.location.pathname.replace(/^\/?display\//, ''))
    return getOptimizedDisplayClasses(optimized, screenIndex, displayConfig)
  } catch (e) {
    console.warn('splitDisplay error — falling back to full list', e)
    return classesList
  }
}

export function getOptimizedDisplayClasses(
  optimizedClasses: ItemizedClassType[],
  screenIndex: number,
  config: DisplayDistributionConfig
): ItemizedClassType[] {
  // Use default config if the passed config is invalid
  const displayConfig = (config && config.maxRowsPerDisplay !== undefined) ? config : DEFAULT_DISPLAY_CONFIG

  const displayAssignments: ItemizedClassType[][] = [[], [], []]
  const display4: ItemizedClassType[] = []
  const displayRowCounts = [0, 0, 0]

  // Distribute classes sequentially starting from display 1
  for (const classType of optimizedClasses) {
    const classRows = 1 + classType.drivers.length
    let placed = false

    // Try to place on displays 1, 2, 3 in order
    for (let i = 0; i < 3; i++) {
      if (displayRowCounts[i] + classRows <= displayConfig.maxRowsPerDisplay) {
        displayAssignments[i].push(classType)
        displayRowCounts[i] += classRows
        placed = true
        break
      }
    }

    // If no space on displays 1-3, place on display 4
    if (!placed) {
      display4.push(classType)
    }
  }



  if (screenIndex >= 1 && screenIndex <= 3) {
    // Sort classes by classIndex within the display
    const displayClasses = displayAssignments[screenIndex - 1] || []
    return displayClasses.sort((a, b) => a.carClass.classIndex - b.carClass.classIndex)
  } else if (screenIndex === 4) {
    // Sort classes by classIndex within display 4
    return display4.sort((a, b) => a.carClass.classIndex - b.carClass.classIndex)
  }

  return []
}
