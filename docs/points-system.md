# Tri-Series Points System

## What Is Tri-Series?

Tri-Series is a club championship points system where clubs accumulate points based on how their members finish within their respective classes across events in the series. The total points for all eligible competitors from a club are summed to produce a club standings table.

## Eligibility

Competitors in the class named **`"Non TriSeries"`** are excluded from points calculations entirely. All other classes contribute to the points tally.

Only competitors with at least one valid (non-zero) time are included in class position calculations.

---

## Points Table

Points are awarded on finishing position within a class. **Class size does not affect the
points on offer** — a win scores 10 whether the class holds two drivers or twenty:

| Position | P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11+ |
|----------|----|----|----|----|----|----|----|----|----|-----|------|
| Points | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |

Eleventh place and beyond receive 0 points.

### Superseded: the 2025 scheme

Until the 2026 season, the points available scaled with class size, so a win in a small class
was worth less than a win in a large one:

| Class size | P1 | P2 | P3 | P4 | P5 | P6 | P7 |
|-----------|----|----|----|----|----|----|-----|
| 1 | 2 | — | — | — | — | — | — |
| 2 | 3 | 2 | — | — | — | — | — |
| 3 | 3 | 2 | 1 | — | — | — | — |
| 4 | 4 | 3 | 2 | 1 | — | — | — |
| 5 | 5 | 4 | 3 | 2 | 1 | — | — |
| 6 | 6 | 5 | 4 | 3 | 2 | 1 | — |
| 7+ | 7 | 6 | 5 | 4 | 3 | 2 | 1 |

That version is kept, commented out and labelled "Pointscore for 2025", in
`calculatePoints()` rather than deleted.

**Standings are not comparable across the two schemes.** Results calculated under the 2025
system would need recalculating to sit alongside results from the current one.

---

## Calculation Algorithm

Implemented in `shared/src/logic/clubPoints.ts`:

1. **Filter** out competitors in "Non TriSeries" class
2. **Group** remaining competitors by `classIndex`
3. For each class:
   a. Filter to competitors with at least one valid time (`time > 0`)
   b. Sort by best time ascending (lowest time = position 1)
   c. Assign positions 1, 2, 3, ...
   d. Award points for each position from the table above
4. **Accumulate** points by club: for each competitor with a club assigned, add their points to their club's running total
5. **Sort** clubs by total points descending

```typescript
// Example: class of 4 drivers
// P1: 10 points, P2: 9 points, P3: 8 points, P4: 7 points

// Club A has drivers finishing P1 and P3 → 10 + 8 = 18 points
// Club B has a driver finishing P2 → 9 points
// Final: Club A wins with 18 points
```

---

## Club Totals

The `ClubPoints` result type:

```typescript
interface ClubPoints {
  club: string     // Club name (from C_CLUB field)
  points: number   // Total accumulated points across all classes
  competitors: number  // Number of competitors that contributed points
}
```

---

## Where Points Are Displayed

- **Display 4** (`/display/4`): Tri-Series points table shown alongside the competitor leaderboard overflow
- **Announcer board** (`/announcer`): Points table shown alongside the class leaderboard

**Source files:**
- Logic: `shared/src/logic/clubPoints.ts`
- Display component: `shared/src/components/display/TriSeriesPoints.tsx`
