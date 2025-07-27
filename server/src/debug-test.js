// Minimal test to debug module resolution on Windows
console.log('=== WINDOWS DEBUG TEST ===')
console.log('Node version:', process.version)
console.log('NODE_PATH:', process.env.NODE_PATH || 'not set')
console.log('Current working directory:', process.cwd())

// Try to import express with error handling
try {
    console.log('Attempting to import express...')
    const express = await import('express')
    console.log('✅ express imported successfully')
} catch (error) {
    console.log('❌ express import failed:', error.message)
    console.log('Error code:', error.code)
    console.log('Error stack:', error.stack)

    // Try to manually resolve the module path using import.meta.resolve
    try {
        const resolvedPath = await import.meta.resolve('express')
        console.log('Import.meta.resolve result:', resolvedPath)
    } catch (resolveError) {
        console.log('Import.meta.resolve failed:', resolveError.message)
    }
}

// Try to import cors with error handling
try {
    console.log('Attempting to import cors...')
    const cors = await import('cors')
    console.log('✅ cors imported successfully')
} catch (error) {
    console.log('❌ cors import failed:', error.message)
    console.log('Error code:', error.code)
}

// Check if node_modules exists
const fs = await import('fs')
const path = await import('path')

const possiblePaths = [
    '/app/node_modules',
    '/app/server/node_modules',
    path.join(process.cwd(), 'node_modules'),
    path.join(process.cwd(), 'server', 'node_modules')
]

console.log('Checking node_modules locations:')
possiblePaths.forEach(p => {
    console.log(`  ${p}: ${fs.existsSync(p) ? 'EXISTS' : 'NOT FOUND'}`)
})

// Check if express package.json exists
const expressPackagePaths = [
    '/app/node_modules/express/package.json',
    path.join(process.cwd(), 'node_modules', 'express', 'package.json')
]

console.log('Checking express package.json:')
expressPackagePaths.forEach(p => {
    console.log(`  ${p}: ${fs.existsSync(p) ? 'EXISTS' : 'NOT FOUND'}`)
})

// Try absolute path import
try {
    console.log('Trying absolute path import...')
    const express = await import('/app/node_modules/express/index.js')
    console.log('✅ Absolute path import successful')
} catch (error) {
    console.log('❌ Absolute path import failed:', error.message)
}

console.log('=== END WINDOWS DEBUG TEST ===') 