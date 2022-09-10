import { Box, Chip, Container, Typography } from '@mui/material'

import { trpc } from '../App'
import { ResultsTable } from '../components/table'
import { Timer } from '@mui/icons-material'

import { requestWrapper } from '../components/requestWrapper'
import { useEffect } from 'react'

let displayInterval: any

export const Display = () => {
  const rows = trpc.useQuery(['competitors.list'])
  const runCount = trpc.useQuery(['runs.count'])

  useEffect(() => {
    if (displayInterval) clearTimeout(displayInterval)
    displayInterval = setTimeout(() => {
      rows.refetch()
      runCount.refetch()
    }, 1000 * 5)
  }, [rows, runCount])

  let classes: { classIndex:number, class:string }[] = []

  const requestErrors = requestWrapper(rows, runCount)
  if (requestErrors) return requestErrors
  if (!rows.data || typeof runCount.data == 'undefined') {
    console.warn('A function was called that should not be called')
    return null
  } // This will never be called, but it is needed to make typescript happy


  // Sort classes in class order as per the index value
  // in the timing software

  let maxClassIndex = 0

  rows.data.forEach(a => {
    if (a.classIndex > maxClassIndex) {
      maxClassIndex = a.classIndex
    }
  })

  for (let i = 1; i < maxClassIndex + 1; i++) {
    let shouldSkip = false
    rows.data.forEach(row => {
      if (shouldSkip) {
        return
      }
      if (row.classIndex === i) {
        classes.push({ classIndex: row.classIndex, class: row.class })
        shouldSkip = true
      }
    })
  }

  const classesList = classes.map((currentElement) => ({
    currentElement,
    drivers: rows.data.filter((data) => data.classIndex === currentElement.classIndex)
  }))

  return (
    <Container>
      {classesList.map((eventClass) => (
        <div key={eventClass.currentElement.class}>
          <Typography component='div'>
            <Box fontWeight='fontWeightMedium' display='inline' lineHeight='3'>
              {eventClass.currentElement.class}&nbsp;&nbsp;&nbsp;&nbsp;
            </Box>
            <Chip
              label={'Class Record: ' + eventClass.drivers[0].classRecord}
              variant='outlined'
              color='info'
              size='medium'
              icon={<Timer />}
            />
          </Typography>
          <ResultsTable
            data={eventClass.drivers.sort(
              (a, b) =>
                Math.min(...a.times.map((time) => time?.time || 10000000)) -
                Math.min(...b.times.map((time) => time?.time || 10000000))
            )}
            keyKey={'number'}
            runCount={runCount.data as number}
          />
        </div>
      ))}
    </Container>
  )
}
