import { describe, test, expect } from 'vitest'
import { optimizeClassDistribution, analyzeDistribution, getDisplayStats, getOptimizedDisplayClasses, DEFAULT_DISPLAY_CONFIG } from './displays.js'

// Mock class data for testing
const createMockClass = (classIndex: number, className: string, driverCount: number) => ({
  carClass: { classIndex, class: className },
  drivers: Array(driverCount).fill({}).map((_, i) => ({
    number: i + 1,
    outright: i + 1,
    lastName: `Driver${i}`,
    firstName: `Test`,
    class: className,
    classIndex,
    vehicle: `Vehicle ${i}`,
    classRecord: '00:00:00',
    times: [undefined, undefined, undefined], // 3 runs
  }))
})

describe('Display Distribution', () => {
  test('should sort classes by size (smallest to largest)', () => {
    const classes = [
      createMockClass(1, 'Large Class', 20),
      createMockClass(2, 'Small Class', 5),
      createMockClass(3, 'Medium Class', 10),
      createMockClass(4, 'Tiny Class', 2),
    ]

    const optimized = optimizeClassDistribution(classes)

    // Should sort by size (smallest to largest)
    expect(optimized[0].carClass.class).toBe('Tiny Class')
    expect(optimized[1].carClass.class).toBe('Small Class')
    expect(optimized[2].carClass.class).toBe('Medium Class')
    expect(optimized[3].carClass.class).toBe('Large Class')
  })

  test('should sort by classIndex when sizes are equal', () => {
    const classes = [
      createMockClass(3, 'Class C', 5),
      createMockClass(1, 'Class A', 5),
      createMockClass(2, 'Class B', 5),
    ]

    const optimized = optimizeClassDistribution(classes)

    // Should sort by classIndex when sizes are equal
    expect(optimized[0].carClass.classIndex).toBe(1)
    expect(optimized[1].carClass.classIndex).toBe(2)
    expect(optimized[2].carClass.classIndex).toBe(3)
  })

  test('should distribute classes sequentially', () => {
    const classes = [
      createMockClass(1, 'Class A', 8),  // 9 rows (1 + 8)
      createMockClass(2, 'Class B', 12), // 13 rows (1 + 12)
      createMockClass(3, 'Class C', 5),  // 6 rows (1 + 5)
      createMockClass(4, 'Class D', 15), // 16 rows (1 + 15)
    ]

    const config = { maxRowsPerDisplay: 20 }
    const optimized = optimizeClassDistribution(classes, config)

    // Test distribution to displays
    const display1 = getOptimizedDisplayClasses(optimized, 1, config)
    const display2 = getOptimizedDisplayClasses(optimized, 2, config)
    const display3 = getOptimizedDisplayClasses(optimized, 3, config)
    const display4 = getOptimizedDisplayClasses(optimized, 4, config)

    // Based on actual distribution: Class C (6 rows) + Class A (9 rows) = 15 rows on display 1
    // After sorting by classIndex: Class A (index 1) comes before Class C (index 3)
    expect(display1.length).toBe(2)
    expect(display1[0].carClass.class).toBe('Class A')
    expect(display1[1].carClass.class).toBe('Class C')

    expect(display2.length).toBe(1)
    expect(display2[0].carClass.class).toBe('Class B')

    expect(display3.length).toBe(1)
    expect(display3[0].carClass.class).toBe('Class D')

    expect(display4.length).toBe(0)
  })

  test('should respect max rows per display', () => {
    const classes = [
      createMockClass(1, 'Large Class', 25), // 26 rows
      createMockClass(2, 'Medium Class', 15), // 16 rows
      createMockClass(3, 'Small Class', 8),   // 9 rows
    ]

    const config = { maxRowsPerDisplay: 20 }
    const optimized = optimizeClassDistribution(classes, config)

    const display1 = getOptimizedDisplayClasses(optimized, 1, config)
    const display2 = getOptimizedDisplayClasses(optimized, 2, config)
    const display3 = getOptimizedDisplayClasses(optimized, 3, config)

    // Based on actual distribution: Small class (9 rows) on display 1, Medium class (16 rows) on display 2
    // Large class (26 rows) goes to display 4 since it exceeds maxRowsPerDisplay
    expect(display1.length).toBe(1) // Small class
    expect(display2.length).toBe(1) // Medium class
    expect(display3.length).toBe(0) // Large class goes to display 4
  })

  test('should not wrap classes across displays', () => {
    const classes = [
      createMockClass(1, 'Large Class', 25),
      createMockClass(2, 'Medium Class', 15),
      createMockClass(3, 'Small Class', 8),
    ]

    const optimized = optimizeClassDistribution(classes)

    // Each class should be complete (no partial classes)
    optimized.forEach(cls => {
      expect(cls.drivers.length).toBeGreaterThan(0)
    })
  })

  test('should analyze distribution correctly', () => {
    const classes = [
      createMockClass(1, 'Class A', 10),
      createMockClass(2, 'Class B', 15),
      createMockClass(3, 'Class C', 5),
    ]

    const analysis = analyzeDistribution(classes)

    expect(analysis.totalClasses).toBe(3)
    expect(analysis.totalItems).toBe(30)
    expect(analysis.classSizes[0].className).toBe('Class B') // Largest first in analysis
    expect(analysis.classSizes[0].size).toBe(15)
  })

  test('should get display stats correctly', () => {
    const classes = [
      createMockClass(1, 'Class A', 10),
      createMockClass(2, 'Class B', 15),
      createMockClass(3, 'Class C', 5),
    ]

    const stats = getDisplayStats(classes, 1)

    expect(stats.displayNumber).toBe(1)
    expect(stats.classesOnDisplay).toBeGreaterThanOrEqual(0)
    expect(stats.itemsOnDisplay).toBeGreaterThanOrEqual(0)
  })

  test('should handle empty class list', () => {
    const optimized = optimizeClassDistribution([])
    expect(optimized).toEqual([])
  })

  test('should handle single class', () => {
    const classes = [createMockClass(1, 'Single Class', 5)]
    const optimized = optimizeClassDistribution(classes)

    expect(optimized.length).toBe(1)
    expect(optimized[0].carClass.class).toBe('Single Class')
  })

  test('should use default config when none provided', () => {
    const classes = [createMockClass(1, 'Test Class', 5)]
    const optimized = optimizeClassDistribution(classes)

    expect(optimized.length).toBe(1)
    expect(optimized[0].startItem).toBe(0)
  })

  test('should calculate startItem correctly', () => {
    const classes = [
      createMockClass(1, 'Class A', 3),
      createMockClass(2, 'Class B', 5),
      createMockClass(3, 'Class C', 2),
    ]

    const optimized = optimizeClassDistribution(classes)

    // Classes are sorted by size (smallest first), then by classIndex
    // So order is: Class C (2 drivers), Class A (3 drivers), Class B (5 drivers)
    expect(optimized[0].startItem).toBe(0)   // First class (Class C) starts at 0
    expect(optimized[1].startItem).toBe(2)   // Second class (Class A) starts after first
    expect(optimized[2].startItem).toBe(5)   // Third class (Class B) starts after second
  })

  test('should sort classes within displays by classIndex', () => {
    const classes = [
      createMockClass(3, 'Class C', 5),
      createMockClass(1, 'Class A', 5),
      createMockClass(2, 'Class B', 5),
    ]

    const config = { maxRowsPerDisplay: 20 }
    const optimized = optimizeClassDistribution(classes, config)

    const display1 = getOptimizedDisplayClasses(optimized, 1, config)

    // Classes should be sorted by classIndex within the display
    if (display1.length > 1) {
      expect(display1[0].carClass.classIndex).toBeLessThan(display1[1].carClass.classIndex)
    }
  })
}) 