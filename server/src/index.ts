import express from 'express'
import * as trpcExpress from '@trpc/server/adapters/express'
import cors from 'cors'
import { existsSync } from 'fs'
import winston from 'winston'

import { trpcRouter } from './router'

const app = express()

// We only want to serve the UI in production. In development we will handle it
// elsewhere
if (existsSync('ui')) app.use(express.static('ui'))

app.use(express.json())
app.use(cors())

app.use(
  '/api/v1/',
  trpcExpress.createExpressMiddleware({
    router: trpcRouter,
  })
)

app.listen(8080, () => console.log('Server listening on port 8080'))
