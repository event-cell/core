import Timer from '@mui/icons-material/Timer'
import { Typography, Box, Chip } from '@mui/material'
import React, { FC, useMemo, useState, useEffect } from 'react'
import { CompetitorList } from 'server/src/router/objects.js'
import { CompetitorTable } from '../table.js'
import { DisplayHeader } from './header.js'
import { DisplayFooter } from './footer.js'
import { getDisplayNumber, splitDisplay, DEFAULT_DISPLAY_CONFIG, DisplayDistributionConfig, ItemizedClassType, ClassType } from '../../logic/displays.js'
import { getPersonalBestSectors } from '../../logic/index.js'
import { OnTrack } from './OnTrack.js'
import { TriSeriesPoints } from './TriSeriesPoints.js'

export const DisplayCompetitorList: FC<{
  competitors: CompetitorList
  runCount: number
  currentCompetitor?: number
}> = ({ competitors, runCount, currentCompetitor }) => {
  const [displayContent, setDisplayContent] = useState<ClassType[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  const classesList = useMemo(() => {
    return classes
      .map((carClass) => ({
        carClass,
        drivers: competitors
          .filter((data) => data.classIndex === carClass.classIndex)
          .sort(
            (a, b) =>
              Math.min(...a.times.map((time) => time?.time || 10000000)) -
              Math.min(...b.times.map((time) => time?.time || 10000000))
          ),
      }))
  }, [competitors, classes])

  // Load display content when classes change
  useEffect(() => {
    const loadDisplayContent = async () => {
      try {
        setIsLoading(true)
        const content = await splitDisplay(classesList)
        setDisplayContent(content)
      } catch (error) {
        console.error('CompetitorList - failed to load display content:', error)
        setDisplayContent(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadDisplayContent()
  }, [classesList])

  const displayNumber = getDisplayNumber()

  if (isLoading) {
    return (
      <>
        <DisplayHeader display={displayNumber} />
        <Typography>Loading display configuration...</Typography>
        <DisplayFooter display={displayNumber} />
      </>
    )
  }

  if (displayContent) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh', // Full viewport height for all displays
          position: 'relative',
        }}
      >
        <DisplayHeader display={displayNumber} />

        <Box sx={{ flex: displayNumber === 4 ? 'none' : 1 }}> {/* Content area */}
          {displayContent.map((eventClass) => (
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
                maxRows={20}
              />
            </div>
          ))}
        </Box>

        {/* OnTrack component for display 4 - appears after competitor list */}
        {displayNumber === 4 && currentCompetitor && (
          <OnTrack
            currentCompetitorId={currentCompetitor}
            competitors={competitors}
          />
        )}

        {/* Tri-Series Points section - only for display 4 */}
        {displayNumber === 4 && (
          <TriSeriesPoints
            competitors={competitors}
            maxDisplay={8}
          />
        )}

        {/* Position footer at bottom for all displays */}
        {displayNumber >= 1 && displayNumber <= 4 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <DisplayFooter display={displayNumber} />
          </Box>
        )}
      </Box>
    )
  } else {
    return <div />
  }
}
