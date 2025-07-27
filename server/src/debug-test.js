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

console.log('=== END WINDOWS DEBUG TEST ===') 