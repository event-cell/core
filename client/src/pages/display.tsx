import React, { useEffect } from 'react'

import { trpc } from '../App'
import { Display } from '../shared/components/display'

import { requestWrapper } from '../components/requestWrapper'

let index = 1

export const DisplayPage = () => {
  const currentCompetitor = trpc.useQuery(['currentcompetitor.number'])
  const allRuns = trpc.useQuery(['competitors.list'])
  const runCount = trpc.useQuery(['runs.count'])

  // console.log(JSON.stringify({ currentCompetitor, allRuns, runCount }))
  console.log('-----> START <------')
  console.time(`Render ${index}`)
  performance.mark(`Render Start ${index}`)

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await Promise.all([
        currentCompetitor.refetch(),
        allRuns.refetch(),
        runCount.refetch(),
      ])
    }, 1000 * 4)
    return () => clearTimeout(timeout)
  }, [currentCompetitor, allRuns, runCount])

  const requestErrors = requestWrapper(currentCompetitor, allRuns, runCount)
  if (requestErrors) return requestErrors

  if (!allRuns.data) {
    console.warn('Missing allRuns data')
    return null
  } // This will never be called, but it is needed to make typescript happy

  if (!currentCompetitor.data) {
    console.warn('Missing currentCompetitor data')
    return null
  }

  if (!runCount.data) {
    console.warn('Missing runCount data')
    return null
  }

  const ret = (
    <Display
      currentCompetitor={currentCompetitor.data}
      allRuns={allRuns.data}
      runCount={runCount.data}
    />
  )

  console.timeEnd(`Render ${index}`)
  performance.mark(`Render end ${index}`)
  index += 1

  return ret
}
