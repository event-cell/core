// server/src/index.ts

import express from 'express'
import * as trpcExpress from '@trpc/server/adapters/express'
import cors from 'cors'
import { existsSync } from 'fs'
import { resolve, join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { cwd } from 'process'

import { trpcRouter } from './router/index.js'
import { setup } from './setup/index.js'
import { executeScheduledTasks } from './scheduledTasks/index.js'
import { getCurrentHeat, setupLogger } from './utils/index.js'
import { getCompetitorJSON } from './router/shared.js'
import { getCurrentCompetitor } from './router/currentCompetitor.js'
import { readFileSync, writeFileSync, chmodSync } from 'fs'

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Function to setup SSH key with proper permissions
async function setupSshKey(): Promise<void> {
  try {
    const configPath = process.env.CONFIG_PATH || '/data/config.json'
    if (!existsSync(configPath)) {
      logger.info('No config file found, skipping SSH key setup')
      return
    }

    const config = JSON.parse(readFileSync(configPath, 'utf8')) as { rsyncSshKeyPath?: string }
    if (!config.rsyncSshKeyPath) {
      logger.info('No SSH key path in config, skipping SSH key setup')
      return
    }

    // Check if the source key file exists
    if (!existsSync(config.rsyncSshKeyPath)) {
      logger.warn(`SSH key file not found: ${config.rsyncSshKeyPath}`)
      return
    }

    // Create .ssh directory in container
    const sshDir = '/app/.ssh'
    if (!existsSync(sshDir)) {
      const { execSync } = await import('child_process')
      execSync(`mkdir -p ${sshDir}`)
      logger.info(`Created SSH directory: ${sshDir}`)
    }

    // Copy key to container with proper permissions
    const containerKeyPath = `${sshDir}/id_rsa`

    // Check if we need to copy the key (if it doesn't exist or has wrong permissions)
    let needsCopy = true
    if (existsSync(containerKeyPath)) {
      try {
        const stats = require('fs').statSync(containerKeyPath)
        const mode = stats.mode & 0o777
        if (mode === 0o600) {
          needsCopy = false
          logger.info('SSH key already exists with correct permissions')
        }
      } catch (error) {
        logger.warn('Could not check key permissions, will copy anyway')
      }
    }

    if (needsCopy) {
      const keyContent = readFileSync(config.rsyncSshKeyPath, 'utf8')
      writeFileSync(containerKeyPath, keyContent)
      chmodSync(containerKeyPath, 0o600) // Set 600 permissions
      logger.info(`SSH key copied to container and permissions set: ${containerKeyPath}`)
    }
  } catch (error) {
    logger.error('Error setting up SSH key:', error)
  }
}

const logger = setupLogger('server')

// Debug module resolution
logger.info('=== MODULE RESOLUTION DEBUG ===')
logger.info(`NODE_PATH: ${process.env.NODE_PATH || 'not set'}`)
logger.info(`Current working directory: ${cwd()}`)
logger.info(`__dirname: ${__dirname}`)

// Check if node_modules exists in various locations
const possibleNodeModulesPaths = [
  '/app/node_modules',
  '/app/server/node_modules',
  join(cwd(), 'node_modules'),
  join(__dirname, 'node_modules'),
  join(__dirname, '..', 'node_modules'),
  join(__dirname, '..', '..', 'node_modules'),
  join(__dirname, '..', '..', '..', 'node_modules')
]

logger.info('Checking for node_modules in:')
possibleNodeModulesPaths.forEach(path => {
  logger.info(`  ${path}: ${existsSync(path) ? 'EXISTS' : 'NOT FOUND'}`)
})

// Check if express exists in node_modules
const expressPaths = [
  '/app/node_modules/express',
  '/app/server/node_modules/express',
  join(cwd(), 'node_modules', 'express'),
  join(__dirname, '..', '..', '..', 'node_modules', 'express')
]

logger.info('Checking for express package in:')
expressPaths.forEach(path => {
  logger.info(`  ${path}: ${existsSync(path) ? 'EXISTS' : 'NOT FOUND'}`)
})

logger.info('=== END MODULE RESOLUTION DEBUG ===')

// Define paths
const uiPath = join(__dirname, 'ui')
const app = express()

  ; (async () => {
    await setup()

    // Setup SSH key with proper permissions
    await setupSshKey()

    // Log working directory and paths
    const workingDir = cwd()
    const serverDir = __dirname
    const absoluteUiPath = resolve(workingDir, uiPath)

    logger.info('Server paths:')
    logger.info(`- Current working directory: ${workingDir}`)
    logger.info(`- Server directory: ${serverDir}`)
    logger.info(`- UI path (relative): ${uiPath}`)
    logger.info(`- UI path (absolute): ${absoluteUiPath}`)
    logger.info(`- UI exists: ${existsSync(uiPath) ? 'Yes' : 'No'}`)

    // We only want to serve the UI in production. In development, we will handle it
    // elsewhere
    if (existsSync(uiPath)) {
      // Serve display assets from the correct location
      app.use('/display/assets', express.static(join(uiPath, 'assets'), {
        setHeaders: (res, path) => {
          // Assets with hashes can be cached longer
          if (path.includes('-') && (path.endsWith('.js') || path.endsWith('.css'))) {
            res.setHeader('Cache-Control', 'public, max-age=31536000') // 1 year
          }
          // Other assets get shorter cache
          else {
            res.setHeader('Cache-Control', 'public, max-age=3600') // 1 hour
          }
        }
      }))

      // Serve static files with cache control headers
      app.use(express.static(uiPath, {
        setHeaders: (res, path) => {
          // HTML files should not be cached
          if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
            res.setHeader('Pragma', 'no-cache')
            res.setHeader('Expires', '0')
          }
          // Assets with hashes can be cached longer
          else if (path.includes('-') && (path.endsWith('.js') || path.endsWith('.css'))) {
            res.setHeader('Cache-Control', 'public, max-age=31536000') // 1 year
          }
          // Other assets get shorter cache
          else {
            res.setHeader('Cache-Control', 'public, max-age=3600') // 1 hour
          }
        }
      }))
      logger.info('Serving UI from:', uiPath)
    } else {
      logger.info('UI not found, skipping static serving')
    }

    app.use(express.json())
    app.use(cors())

    app.use(
      '/api/v1/',
      trpcExpress.createExpressMiddleware({
        router: trpcRouter,
      }),
    )

    logger.info('Server started')

    app.get('/api/simple/currentCompetitor.json', async (req, res) => {
      res.json(await getCurrentCompetitor())
    })
    app.get('/api/simple/competitors.json', async (req, res) => {
      res.json(await getCompetitorJSON())
    })
    app.get('/api/simple/runs.json', async (req, res) => {
      res.json(await getCurrentHeat())
    })

    logger.info('gets defined')

    // Pass all unfound routes to the UI for react-router to handle
    app.get('/admin', (req, res) => {
      if (!existsSync(uiPath)) {
        res.status(504).send('Server error: The UI has not been built with the server')
        return
      }
      logger.info('Serving index.html for admin route')
      res.sendFile(join(uiPath, 'index.html'))
    })

    app.get('/display', (req, res) => {
      if (!existsSync(uiPath)) {
        res.status(504).send('Server error: The UI has not been built with the server')
        return
      }
      logger.info('Serving index.html for display route')
      res.sendFile(join(uiPath, 'index.html'))
    })

    // Handle specific display routes
    app.get('/display/1', (req, res) => {
      if (!existsSync(uiPath)) {
        res.status(504).send('Server error: The UI has not been built with the server')
        return
      }
      logger.info('Serving index.html for display/1 route')
      res.sendFile(join(uiPath, 'index.html'))
    })

    app.get('/display/2', (req, res) => {
      if (!existsSync(uiPath)) {
        res.status(504).send('Server error: The UI has not been built with the server')
        return
      }
      logger.info('Serving index.html for display/2 route')
      res.sendFile(join(uiPath, 'index.html'))
    })

    app.get('/display/3', (req, res) => {
      if (!existsSync(uiPath)) {
        res.status(504).send('Server error: The UI has not been built with the server')
        return
      }
      logger.info('Serving index.html for display/3 route')
      res.sendFile(join(uiPath, 'index.html'))
    })

    app.get('/display/4', (req, res) => {
      if (!existsSync(uiPath)) {
        res.status(504).send('Server error: The UI has not been built with the server')
        return
      }
      logger.info('Serving index.html for display/4 route')
      res.sendFile(join(uiPath, 'index.html'))
    })

    app.get('/trackdisplay', (req, res) => {
      if (!existsSync(uiPath)) {
        res.status(504).send('Server error: The UI has not been built with the server')
        return
      }
      logger.info('Serving index.html for trackdisplay route')
      res.sendFile(join(uiPath, 'index.html'))
    })

    app.get('/announcer', (req, res) => {
      if (!existsSync(uiPath)) {
        res.status(504).send('Server error: The UI has not been built with the server')
        return
      }
      logger.info('Serving index.html for announcer route')
      res.sendFile(join(uiPath, 'index.html'))
    })

    const serverPort = process.env.PORT || 8080

    app.listen(serverPort, () =>
      logger.info(`Server listening on port ${serverPort}`),
    )

    const mins = 1
    // Start Immediately
    logger.info('Running scheduled tasks')
    await executeScheduledTasks()
    // and then loop
    setInterval(
      async () => {
        await executeScheduledTasks()
      },
      mins * 60 * 1000,
    )
  })()
