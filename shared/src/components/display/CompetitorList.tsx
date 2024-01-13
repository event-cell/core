import Timer from '@mui/icons-material/Timer'
import { Typography, Box, Chip } from '@mui/material'
import React, { FC, useMemo } from 'react'
import { CompetitorList } from 'server/src/router/objects'
import { CompetitorTable } from '../table'
import { DisplayHeader } from './header'
import { getDisplayNumber, splitDisplay } from '../../logic/displays'

export const DisplayCompetitorList: FC<{
  competitors: CompetitorList
  runCount: number
}> = ({ competitors, runCount }) => {
  // Make sure there are no duplicate classes in the list
  const classes = useMemo(
    () =>
      competitors.reduce<{ classIndex: number; class: string }[]>(
        (all, current) => {
          const currentRunIncluded = all.some(
            (cls) => cls.classIndex == current.classIndex
          )
          if (currentRunIncluded) return all

          return [
            ...all,
            { classIndex: current.classIndex, class: current.class },
          ]
        },
        []
      ),
    [competitors]
  )

  const printClassesList = useMemo(() => {
    const classesList = classes.map((carClass) => ({
      carClass,
      drivers: competitors
        .filter((data) => data.classIndex === carClass.classIndex)
        .sort(
          (a, b) =>
            Math.min(...a.times.map((time) => time?.time || 10000000)) -
            Math.min(...b.times.map((time) => time?.time || 10000000))
        ),
    }))

    const displayContent = splitDisplay(classesList)

    if (!displayContent) return

    return displayContent
  }, [classes])

  const displayNumber = getDisplayNumber()

  if (printClassesList) {
    return (
      <>
        <DisplayHeader display={displayNumber} />

        {printClassesList.map((eventClass) => (
          <div key={eventClass.carClass.class}>
            <Typography component="div">
              <Box
                sx={{
                  display: 'grid',
                  gridAutoColumns: '1fr',
                }}
              >
                <Box
                  fontWeight="fontWeightMedium"
                  sx={{
                    gridColumn: '1 / 3',
                    m: 1,
                  }}
                >
                  {eventClass.carClass.class}
                </Box>
                <Box
                  sx={{
                    gridColumn: '3 / 4',
                    m: 1,
                  }}
                >
                  <Chip
                    label={'Class Record: ' + eventClass.drivers[0].classRecord}
                    variant="outlined"
                    color="info"
                    size="small"
                    icon={<Timer />}
                  />
                </Box>
              </Box>
            </Typography>
            <CompetitorTable
              data={eventClass.drivers.sort(
                (a, b) =>
                  Math.min(...a.times.map((time) => time?.time || 10000000)) -
                  Math.min(...b.times.map((time) => time?.time || 10000000))
              )}
              runCount={runCount}
            />
          </div>
        ))}
      </>
    )
  } else {
    return <div />
  }
}
