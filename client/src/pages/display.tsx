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

  let classes: { classIndex: number, class: string }[] = []

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

  const classesList = classes.map((carClass) => ({
    carClass,
    drivers: rows.data.filter((data) => data.classIndex === carClass.classIndex)
  }))

  // Calculate ClassesList for each screen
  // Max 20 elements per screen

  let classesListScreen01: { carClass: any, drivers: any }[] = []
  let classesListScreen02: { carClass: any, drivers: any }[] = []
  let classesListScreen03: { carClass: any, drivers: any }[] = []
  let classesListScreen04: { carClass: any, drivers: any }[] = []

  let screenLength = 0
  const targetScreenLength = 23
  if (window.location.pathname !== '/display') {
    classesList.forEach(currentClass => {
      screenLength = screenLength + Object.keys(currentClass.drivers).length + 1
      if (screenLength <= targetScreenLength) {
        classesListScreen01.push(currentClass)
      } else if (screenLength > targetScreenLength && screenLength <= targetScreenLength * 2) {
        classesListScreen02.push(currentClass)
      }
      if (screenLength > targetScreenLength * 2 && screenLength <= targetScreenLength * 3) {
        classesListScreen03.push(currentClass)
      } else if (screenLength > targetScreenLength * 3) {
        classesListScreen04.push(currentClass)
      }
    })
  }

  let printClassesList: { carClass: any, drivers: any }[] = []
  if (window.location.pathname !== '/display') {
    if (window.location.pathname === '/display/1') {
      printClassesList = classesListScreen01
    } else if (window.location.pathname === '/display/2') {
      printClassesList = classesListScreen02
    } else if (window.location.pathname === '/display/3') {
      printClassesList = classesListScreen03
    } else if (window.location.pathname === '/display/4') {
      printClassesList = classesListScreen04
    }
  } else {
    printClassesList = classesList
  }

  return (
    <Container>
      {printClassesList.map((eventClass) => (
        <div key={eventClass.carClass.class}>
          <Typography component='div'>
            <Box fontWeight='fontWeightMedium' display='inline' lineHeight='3'>
              {eventClass.carClass.class}&nbsp;&nbsp;&nbsp;&nbsp;
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
              (a: { times: any[] }, b: { times: any[] }) =>
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
