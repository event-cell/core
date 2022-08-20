import { join } from 'path'
import { existsSync, readFileSync } from 'fs'
import { Database } from 'sqlite3'
import winston from 'winston'

import { config } from '../config'

const sqlCreationFile = join(__dirname, '../../prisma', 'records.sql')

export async function setupRecordsDB() {
  const recordsLocation = join(config.recordsDatabasePath, 'records.sqlite')

  if (existsSync(recordsLocation)) return

  winston.info('Creating records db')

  const database = new Database(recordsLocation)

  await new Promise((res) =>
    database.run(readFileSync(sqlCreationFile, { encoding: 'utf-8' }), () =>
      database.close(res)
    )
  )
}