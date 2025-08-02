#!/usr/bin/env node

// Test script to see how pathname parsing works
const testPaths = [
    '/display/1',
    '/display/2',
    '/display/3',
    '/display/4',
    '/display',
    '/admin/',
    '/some-other-path'
]

console.log('=== Testing Pathname Parsing ===')

for (const pathname of testPaths) {
    console.log(`\nPathname: ${pathname}`)
    console.log(`  includes('/display/'): ${pathname.includes('/display/')}`)
    console.log(`  split('/')[1]: ${pathname.split('/')[1]}`)
    console.log(`  split('/')[1].includes('-'): ${pathname.split('/')[1]?.includes('-') || false}`)

    // Test the full condition
    const condition = (
        pathname === '/display' ||
        !pathname.includes('/display/') ||
        pathname.split('/')[1]?.includes('-') || false
    )
    console.log(`  Early return condition: ${condition}`)
} 