import express from 'express'
import * as trpcExpress from '@trpc/server/adapters/express'
import cors from 'cors'

import { trpcRouter } from './router'

const app = express()

app.use(express.json())
app.use(cors())

app.use(
  '/api/v1/',
  trpcExpress.createExpressMiddleware({
    router: trpcRouter,
  })
)

app.listen(8080, () => console.log('Server listening on port 8080'))
