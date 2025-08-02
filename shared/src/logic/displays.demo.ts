import { optimizeClassDistribution, analyzeDistribution, getDisplayStats, DEFAULT_DISPLAY_CONFIG } from './displays.js'

// Demo function to show the dynamic space allocation in action
export const demonstrateDynamicAllocation = (): void => {
    console.log('=== Dynamic Space Allocation Demo ===\n')

    // Create sample classes with different sizes
    const sampleClasses = [
        { classIndex: 1, className: 'Sports Cars', driverCount: 25 },
        { classIndex: 2, className: 'Sedans', driverCount: 18 },
        { classIndex: 3, className: 'SUVs', driverCount: 12 },
        { classIndex: 4, className: 'Trucks', driverCount: 8 },
        { classIndex: 5, className: 'Motorcycles', driverCount: 6 },
        { classIndex: 6, className: 'Vintage', driverCount: 4 },
        { classIndex: 7, className: 'Modified', driverCount: 3 },
    ]

    // Create mock class data
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
            times: [undefined, undefined, undefined],
        }))
    })

    const classes = sampleClasses.map(cls => createMockClass(cls.classIndex, cls.className, cls.driverCount))

    // Analyze the distribution
    const analysis = analyzeDistribution(classes)
    console.log('📊 Distribution Analysis:')
    console.log(`Total Classes: ${analysis.totalClasses}`)
    console.log(`Total Items: ${analysis.totalItems}`)
    console.log('\nClass Sizes (sorted by size):')
    analysis.classSizes.forEach((cls, index) => {
        console.log(`  ${index + 1}. ${cls.className}: ${cls.size} drivers`)
    })

    console.log('\n📺 Estimated Display Distribution:')
    analysis.estimatedDisplayDistribution.forEach(display => {
        console.log(`  Display ${display.display}: ~${display.itemsOnDisplay} items`)
    })

    // Show optimized distribution
    const optimized = optimizeClassDistribution(classes)
    console.log('\n🎯 Optimized Distribution:')
    console.log('Classes ordered by size (largest first):')
    optimized.forEach((cls, index) => {
        console.log(`  ${index + 1}. ${cls.carClass.class}: ${cls.drivers.length} drivers (startItem: ${cls.startItem})`)
    })

    // Show display-specific stats
    console.log('\n📱 Display-Specific Statistics:')
    for (let display = 1; display <= 4; display++) {
        const stats = getDisplayStats(classes, display)
        console.log(`\nDisplay ${display}:`)
        console.log(`  Classes: ${stats.classesOnDisplay}`)
        console.log(`  Items: ${stats.itemsOnDisplay}`)
        if (stats.classes.length > 0) {
            console.log(`  Classes: ${stats.classes.map(c => `${c.className} (${c.itemCount})`).join(', ')}`)
        }
    }

    // Show configuration
    console.log('\n⚙️ Current Configuration:')
    console.log(`Max rows per display: ${DEFAULT_DISPLAY_CONFIG.maxRowsPerDisplay}`)

    console.log('\n✅ Dynamic Space Allocation Demo Complete!')
}

// Run the demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    demonstrateDynamicAllocation()
} 