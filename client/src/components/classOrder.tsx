// Manual class ordering for the display boards.
//
// The automatic packing sorts classes smallest-first and fills displays 1-3 in
// turn, which is not always the arrangement that fits — and it cannot know
// which classes belong together. This lets the admin decide, and shows the
// consequence immediately: the point is not the order itself but whether
// everything lands before display 4.

import React, { FC, useMemo, useState } from 'react'
import { Box, Chip, IconButton, Paper, Typography } from '@mui/material'
import ArrowUpward from '@mui/icons-material/ArrowUpward'
import ArrowDownward from '@mui/icons-material/ArrowDownward'
import DragIndicator from '@mui/icons-material/DragIndicator'

import {
  applyClassOrder,
  getOptimizedDisplayClasses,
  optimizeClassDistribution,
  type ClassType,
} from 'ui-shared'

export interface ClassSummary {
  classIndex: number
  className: string
  drivers: number
}

/** A class costs one row for its heading plus one per driver */
const rowCost = (drivers: number) => drivers + 1

export const ClassOrderEditor: FC<{
  classes: ClassSummary[]
  order: number[]
  maxRowsPerDisplay: number
  onChange: (order: number[]) => void
}> = ({ classes, order, maxRowsPerDisplay, onChange }) => {
  const [dragging, setDragging] = useState<number | null>(null)

  // The list as it currently stands: the stored order, then anything unplaced
  const ordered = useMemo(() => {
    const asClassTypes: ClassType[] = classes.map((c) => ({
      carClass: { classIndex: c.classIndex, class: c.className },
      drivers: Array.from({ length: c.drivers }) as never,
    }))

    return applyClassOrder(asClassTypes, order).map(
      (c) => classes.find((x) => x.classIndex === c.carClass.classIndex)!,
    )
  }, [classes, order])

  // Where those classes would land, using the same logic the boards use
  const preview = useMemo(() => {
    const asClassTypes: ClassType[] = ordered.map((c) => ({
      carClass: { classIndex: c.classIndex, class: c.className },
      drivers: Array.from({ length: c.drivers }) as never,
    }))

    const config = { maxRowsPerDisplay, classOrder: ordered.map((c) => c.classIndex) }
    const optimized = optimizeClassDistribution(asClassTypes, config)

    return [1, 2, 3, 4].map((display) => {
      const on = getOptimizedDisplayClasses(optimized, display, config)
      return {
        display,
        rows: on.reduce((sum, c) => sum + rowCost(c.drivers.length), 0),
        classes: on.map((c) => c.carClass.class),
      }
    })
  }, [ordered, maxRowsPerDisplay])

  const move = (from: number, to: number) => {
    if (to < 0 || to >= ordered.length || from === to) return
    const next = [...ordered]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange(next.map((c) => c.classIndex))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {ordered.map((cls, index) => (
          <Paper
            key={cls.classIndex}
            variant="outlined"
            draggable
            onDragStart={() => setDragging(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragging !== null) move(dragging, index)
              setDragging(null)
            }}
            onDragEnd={() => setDragging(null)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1,
              cursor: 'grab',
              opacity: dragging === index ? 0.4 : 1,
            }}
          >
            <DragIndicator fontSize="small" color="disabled" />
            <Typography sx={{ flex: 1 }}>{cls.className}</Typography>
            <Chip
              size="small"
              label={`${cls.drivers} ${cls.drivers === 1 ? 'driver' : 'drivers'} · ${rowCost(cls.drivers)} rows`}
            />
            {/* Buttons as well as dragging: these are set up on touch screens,
                and a drag is awkward there and impossible by keyboard */}
            <IconButton size="small" disabled={index === 0} onClick={() => move(index, index - 1)}>
              <ArrowUpward fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              disabled={index === ordered.length - 1}
              onClick={() => move(index, index + 1)}
            >
              <ArrowDownward fontSize="small" />
            </IconButton>
          </Paper>
        ))}
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Where these land
        </Typography>
        {preview.map(({ display, rows, classes: names }) => (
          <Box
            key={display}
            sx={{ display: 'flex', gap: 1, alignItems: 'baseline', fontSize: '0.85rem' }}
          >
            <Box sx={{ width: 90, color: 'text.secondary' }}>Display {display}</Box>
            <Box sx={{ width: 110, color: display === 4 && rows > 0 ? 'warning.main' : 'text.secondary' }}>
              {display === 4
                ? rows > 0 ? `overflow · ${rows} rows` : 'empty'
                : `${rows}/${maxRowsPerDisplay} rows`}
            </Box>
            <Box sx={{ flex: 1 }}>{names.join(' · ') || '—'}</Box>
          </Box>
        ))}
        <Typography variant="caption" color="text.secondary">
          Display 4 also carries On Track and the points table, so classes landing there have less
          room. Reorder until 1–3 hold everything you want on them.
        </Typography>
      </Box>
    </Box>
  )
}
