import AWS from 'aws-sdk'
import fs from 'fs'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { setupLogger } from '../utils'
import StaticApp from './live-timing/live-timing'

const logger = setupLogger('scheduledTasks/scheduledTasks')

// Initialize the S3 client with Cloudflare R2 credentials
const s3 = new AWS.S3({
  endpoint: 'https://<account-id>.r2.cloudflarestorage.com',
  accessKeyId: 'your-access-key-id',
  secretAccessKey: 'your-secret-access-key',
  region: 'auto',
  signatureVersion: 'v4'
})

async function uploadLiveTiming() {
  logger.info('Uploading live timing...')

  const outputPath = path.join(__dirname, 'static/live-timing.html')
  const outputDir = path.dirname(outputPath)

  try {
    // Render the React component to a static HTML string
    const htmlContent: string = ReactDOMServer.renderToStaticMarkup(<StaticApp />)

    // Ensure the directory exists
    fs.mkdirSync(outputDir, { recursive: true })

    // Write the HTML string to a file
    fs.writeFileSync(outputPath, htmlContent)

    const key = 'static/live-timing.html'

    const fileStream = fs.createReadStream(outputPath)
    const uploadParams = {
      Bucket: 'your-bucket-name',
      Key: key,
      Body: fileStream
    }

    const result = await s3.upload(uploadParams).promise()
    logger.info('Live timing uploaded successfully:', result)
  } catch (error) {
    logger.error('Error rendering or uploading live timing:', error)
  }
}

export async function executeScheduledTasks() {
  logger.info('Task Scheduler called')

  // Call the uploadLiveTiming function
  await uploadLiveTiming()

  // Other scheduled tasks can be added here
  // Check for new records
  // for (let i = 1; i < Number(config.eventId); i++) {
  //   const processingEventId = ('000' + i).slice(-3)
  //   logger.info(processingEventId)
  //   const { event, eventData } = getEventDatabases(processingEventId)
  //   const date = (await event.tPARAMETERS.findFirst({
  //     where: { C_PARAM: 'DATE' },
  //   })) || { C_PARAM: 'DATE', C_VALUE: 0 }
  //   await event.$disconnect()
  //   await eventData.$disconnect()
  //   if (date.C_VALUE !== null) {
  //     logger.info(new Date((Number(date.C_VALUE) - (25567 + 1)) * 86400 * 1000))
  //   }
  // }
}
