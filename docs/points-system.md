# Tri-Series Points System

## What Is Tri-Series?

Tri-Series is a club championship points system where clubs accumulate points based on how their members finish within their respective classes across events in the series. The total points for all eligible competitors from a club are summed to produce a club standings table.

## Eligibility

Competitors in the class named **`"Non TriSeries"`** are excluded from points calculations entirely. All other classes contribute to the points tally.

Only competitors with at least one valid (non-zero) time are included in class position calculations.

---

## Points Table

Points are awarded based on finishing position within a class. The number of points available scales with class size:

| Class size | P1 | P2 | P3 | P4 | P5 | P6 | P7 |
|-----------|----|----|----|----|----|----|-----|
| 1 | 2 | — | — | — | — | — | — |
| 2 | 3 | 2 | — | — | — | — | — |
| 3 | 3 | 2 | 1 | — | — | — | — |
| 4 | 4 | 3 | 2 | 1 | — | — | — |
| 5 | 5 | 4 | 3 | 2 | 1 | — | — |
| 6 | 6 | 5 | 4 | 3 | 2 | 1 | — |
| 7+ | 7 | 6 | 5 | 4 | 3 | 2 | 1 |

Positions beyond the table (e.g., 4th in a class of 3) receive 0 points.

---

## Calculation Algorithm

Implemented in `shared/src/logic/clubPoints.ts`:

1. **Filter** out competitors in "Non TriSeries" class
2. **Group** remaining competitors by `classIndex`
3. For each class:
   a. Filter to competitors with at least one valid time (`time > 0`)
   b. Sort by best time ascending (lowest time = position 1)
   c. Assign positions 1, 2, 3, ...
   d. Look up points for each position using the table above (based on class size)
4. **Accumulate** points by club: for each competitor with a club assigned, add their points to their club's running total
5. **Sort** clubs by total points descending

```typescript
// Example: class of 4 drivers
// P1: 4 points, P2: 3 points, P3: 2 points, P4: 1 point

// Club A has drivers finishing P1 and P3 → 4 + 2 = 6 points
// Club B has a driver finishing P2 → 3 points
// Final: Club A wins with 6 points
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
