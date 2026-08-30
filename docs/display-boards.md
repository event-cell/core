# Display Boards

## Overview

| Board | URL | Default Refresh | Purpose |
|-------|-----|----------------|---------|
| Index | `/` | N/A | Links to every board below |
| Display 1 | `/display/1` | 15 seconds | Competitor leaderboard, classes A–C |
| Display 2 | `/display/2` | 15 seconds | Competitor leaderboard, classes D–F |
| Display 3 | `/display/3` | 15 seconds | Competitor leaderboard, classes G–I |
| Display 4 | `/display/4` | 5 seconds | Overflow classes + On Track + Tri-Series points |
| Track Display | `/trackdisplay` | 2 seconds | Live sector times for current competitor |
| Announcer | `/announcer` | 2 seconds | Competitor info + class leaderboard + points |
| Admin | `/admin` | N/A | Configuration and end-of-day results |

All boards also use a secondary fallback full-page refresh (default: every 5 minutes) and an error-triggered refresh (with a 15-second cooldown between reloads).

---

## Display 1–4 — Competitor Leaderboards

**Source:** `client/src/pages/display.tsx`, `shared/src/logic/displays.ts`

These four boards collectively show all competitors sorted by class and best time within class. The competitor list is distributed across the four screens so that no single screen is overloaded.

### Speed per run

Each run cell carries a third line under the sector times showing the radar speed for that run,
left-aligned beneath them and read as `118 kph`. Where no speed was recorded the line reads `--`,
so a gap never looks like a rendering fault and every cell keeps the same height.

A speed is only shown for a run that stood: `DNF`, `DSQ` and `DNS` runs always read `--`.

Speeds come from `car_speeds` in `Speeds.db`, keyed by heat — which is the run number — so history
recorded before this feature displays too. See [configuration.md](./configuration.md) for the radar
and database settings.

### Class Distribution Algorithm

Classes are assigned to displays 1–3 in sequence. By default they are ordered smallest class to
largest; if an order has been set on the admin page, that order is used instead. If a class does not
fit on displays 1–3 (because adding it would exceed `maxRowsPerDisplay`), it is placed on display 4.

Classes not named in a manual order follow the ones that are, still smallest-first, so a class added
mid-event always appears somewhere.

```
All classes (sorted: smallest → largest by driver count)
        |
        v
  +-----+------+------+-------+
  | D1  |  D2  |  D3  |  D4   |
  +-----+------+------+-------+
  | Fit classes sequentially  |
  | into D1 → D2 → D3         |
  | Overflow → D4             |
  +---------------------------+

Each class occupies:
  1 row (header) + N rows (one per driver)
  Total = 1 + N rows per class

maxRowsPerDisplay controls the cutoff (default: 20, range: 15–30)
```

Within each display, classes are then sorted by `classIndex` (ascending) for consistent ordering.

### Display 4 Extras

Display 4 also shows:
- **On Track** panel: shows the competitor currently on course (from `currentcompetitor.number`)
- **Tri-Series Points** panel: club championship points table

### Refresh Rate

Displays 1–3 default to 15 seconds. Display 4 defaults to 5 seconds (faster, to keep the On Track panel current).

---

## Track Display — `/trackdisplay`

**Source:** `client/src/pages/trackDisplay.tsx`

Designed to be shown on a large TV at the side of the track. Shows real-time sector and finish times for the competitor currently on course.

### Screen Layout

```
+----------------------------------------------------------+
|   [top margin — 40px TV overscan]                        |
+----------------------------------------------------------+
|   [Sector 1 color]  [Sector 2 color]  [Sector 3 color]  |  40px
+----------------------------------------------------------+
|      12.34               8.71               9.05         |  120px sector times
+----------------------------------------------------------+
|   [Finish color bar — full width]                        |  60px
+----------------------------------------------------------+
|                                                          |
|   58.10                          121                     |  240px
|   (finish time, 280px font)      km/h  (radar speed)     |
|                                  ----------------        |
|                                  SDMA  (club)            |
+----------------------------------------------------------+
|   [20px spacer]                                          |
+----------------------------------------------------------+
|   JOHN SMITH                                             |  80px competitor name
+----------------------------------------------------------+
|   [bottom margin — 20px]                                 |
+----------------------------------------------------------+
```

The layout uses a CSS Grid with two columns:
- **Left (2fr):** finish time (left-justified, 280px font)
- **Right (1fr):** radar speed above the club name (both centered)

### Radar Speed

The top of the right column shows the maximum speed recorded by the radar for the
current run, in whole km/h, polled from `speed.current` on the track display's
refresh interval.

The panel is **blank whenever there is no speed for the run on course** — the radar
keeps reporting the last pass it saw, so a car that has started a run but not yet
reached the speed trap would otherwise show the previous car's speed. A reading
only appears once the car trips the trap, which sits beyond the first split. A
blank panel is also what an unreachable radar looks like; the rest of the board is
unaffected.

Each pass is also recorded in `Speeds.db` — see [configuration.md](./configuration.md)
for the radar settings and the database schema.

### Sector Color Coding

Each sector bar is colored to indicate performance relative to class and personal bests:

| Color | Meaning |
|-------|---------|
| Purple | Time is ≤ current class best (class record or equal) |
| Green | Time is ≤ personal best, but slower than class best |
| Yellow | Time is slower than personal best |
| Gray (background) | Sector not yet completed (time = 0) |

The same colors apply to the finish indicator bar.

### Data Shown

- Three sector times (in seconds, 2 decimal places)
- Three sector color bars
- One finish indicator color bar
- Finish time (or "DNF"/"DSQ" with icon for non-finishers)
- Competitor name (uppercase)
- Club name (uppercase, right side)

### Refresh

Default: 2 seconds (React Query refetch). Configurable via admin page.

---

## Announcer Board — `/announcer`

**Source:** `client/src/pages/announcer.tsx`

Shown on a screen at the announcer's desk. Provides richer context for commentary.

### Content

- **Competitor info panel:** current competitor's name, number, class, vehicle, club
- **Class leaderboard:** top 3 competitors in the current competitor's class, with times
- **Tri-Series points table:** current club championship standings

### Refresh

Default: 2 seconds. Configurable via admin page.

---

## Refresh Mechanism Detail

All display pages implement the same three-tier refresh strategy:

```
                                 Display Page
                                      |
              +-----------------------+-----------------------+
              |                       |                       |
        [PRIMARY]                [SECONDARY]            [TERTIARY]
    React Query refetch        Full page reload       Error-based reload
    (configurable interval)    (fallback interval,    (on JS error or
    Default:                   default 5 min)         unhandled rejection)
      displays 1-3: 15s                               15s cooldown between
      display 4:    5s                                reloads
      trackdisplay: 2s
      announcer:    2s
```

All three intervals are configurable from the admin page and persisted in `config.json`.
