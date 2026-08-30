# Database Deep-Dive

## Overview

Msport Pro timing software creates three SQLite database files per event. The directory holding them
is mounted **read-write** so the server can own `Speeds.db` alongside them, but the `.scdb` files
themselves are only ever read. The system uses Prisma ORM for typed access, with four separate Prisma schema files (one per database type, plus a records DB).

## File Layout

```
/app/prisma/Events/          (configurable via eventDatabasePath)
├── Online.scdb              ← Live system state (optional — may be empty or absent)
├── Event{id}.scdb           ← Competitor metadata (names, classes, vehicles)
└── Event{id}Ex.scdb         ← All timing data (heats 1–9)
```

`{id}` is the event identifier configured in `config.json` (e.g., `"001"`).

The Prisma clients are initialized in `server/src/dbUtils.ts`. If `Online.scdb` is absent or empty, the `online` client is set to `null` and the system degrades gracefully.

---

## Online.scdb — `schemaOnline.prisma`

Contains live system state updated by Msport Pro during the event.

### TPARAMETERS

Key-value store for system state.

| Column | Type | Description |
|--------|------|-------------|
| C_PARAM | String (PK) | Parameter name |
| C_VALUE | String? | Parameter value |

**Key rows:**

| C_PARAM | C_VALUE example | Meaning |
|---------|----------------|---------|
| `HEAT` | `"3"` | Current heat / run number (1–9) |

This is how the system knows which heat tables to read for the current run.

---

## Event{id}.scdb — `schemaEvent.prisma`

Contains competitor registration data for the event.

### TCOMPETITORS

One row per registered competitor.

| DB Column | Type | System Meaning | Example |
|-----------|------|---------------|---------|
| C_IDX | Int (PK) | Internal row ID | 42 |
| C_NUM | Int? | Competitor number (car number) | 17 |
| C_TRANSPONDER1 | String? | Primary transponder ID | "AB1234" |
| C_TRANSPONDER2 | String? | Secondary transponder ID | — |
| C_LAST_NAME | String? | **First name** (note: columns are swapped) | "John" |
| C_FIRST_NAME | String? | **Last name** (note: columns are swapped) | "Smith" |
| C_CLUB | String? | Club name | "SDMA" |
| C_SERIE | String? | Class name (fallback) | "Open" |
| C_COMMITTEE | String? | **Vehicle description** (repurposed field) | "EG Civic" |
| C_TEAM | String? | **Class record time** (repurposed field) | "58.32" |
| C_I21 | Int? | **Class index** (numeric class ID for grouping) | 3 |
| C_I28 | String? | **Special category** (e.g., "Lady", "Junior") | "Lady" |
| C_I29 | String? | **Class name** (preferred over C_SERIE if present) | "Open 2WD" |
| C_I30 | String? | **Misc award** field | — |

**Note on name column swap:** Msport Pro stores first name in `C_LAST_NAME` and last name in `C_FIRST_NAME`. The system reads them as:
```typescript
lastName: competitor.C_FIRST_NAME   // actual last name
firstName: competitor.C_LAST_NAME   // actual first name
```

**Class name resolution:** The system uses `C_I29` if present, otherwise falls back to `C_SERIE`:
```typescript
let className = competitor.C_I29 || competitor.C_SERIE || 'N/A';
```

### TPARAMETERS (Event DB)

| C_PARAM | C_VALUE example | Meaning |
|---------|----------------|---------|
| `DATE` | `"45000"` | Event date as Excel serial number |
| `TITLE2` | `"Spring Motorkhana 2024"` | Event name/title |

**Excel serial date conversion:**
Excel serial numbers count days since 1 January 1900. To convert to a JavaScript Date:
```
Unix timestamp (ms) = (excelSerial - 25569) × 86400 × 1000
```
Where 25569 is the number of days between 1900-01-01 and 1970-01-01 (Unix epoch).

---

## Event{id}Ex.scdb — `schemaEventData.prisma`

Contains all timing data. Tables are replicated for each heat (run) 1–9.

### TTIMEINFOS_HEAT1 through TTIMEINFOS_HEAT9

The primary timing result tables. One row per competitor per heat.

| Column | Type | Description |
|--------|------|-------------|
| C_NUM | Int (PK) | Competitor number |
| C_STATUS | Int? | Run status (see values below) |
| C_TIME | Int? | Finish time in **milliseconds** |
| C_PENALTY | Int? | Penalty time in milliseconds |
| C_INTER1 | Int? | Split 1 (intermediate 1) time in milliseconds |
| C_INTER2 | Int? | Split 2 (intermediate 2) time in milliseconds |
| C_INTER3–9 | Int? | Additional intermediates (not currently used) |
| C_SPEED1–9 | Int? | Speed trap readings |
| C_DATA1–8 | Int? | Additional data fields |
| C_REASON | String? | Reason for DSQ/DNF |

**C_STATUS values:**

| Value | Meaning |
|-------|---------|
| `0` | Finished (valid time) |
| `2` | DNF (Did Not Finish) |
| `3` | DSQ (Disqualified) |
| `65536` | Currently on course (timing in progress) |

### TSTARTLIST_HEAT1 through TSTARTLIST_HEAT9

Start times for each competitor in each heat.

| Column | Type | Description |
|--------|------|-------------|
| C_LINE | Int (PK) | Row ID |
| C_NUM | Int? | Competitor number |
| C_START | Int? | Scheduled start time |

### TCHRONOMESSAGES_HEAT1 through TCHRONOMESSAGES_HEAT9

Raw messages from the timing system for each heat.

| Column | Type | Description |
|--------|------|-------------|
| C_LINE | Int (PK) | Row ID |
| C_NUM | Int? | Competitor number |
| C_STATUS | Int? | Message status |
| C_TRANSPONDER | String? | Transponder that triggered this event |
| C_CANAL | String? | Timing channel (START, INTER1, INTER2, FINISH) |
| C_MESSAGE | String? | Raw message text |

### TTIMERECORDS_HEAT{n}_{START|INTER1|INTER2|FINISH}

Raw transponder passage records at each timing point. Four tables per heat × nine heats = 36 tables total.

| Column | Type | Description |
|--------|------|-------------|
| C_LINE | Int (PK) | Row ID |
| C_NUM | Int? | Competitor number |
| C_STATUS | Int? | Status |
| C_HOUR1 | String? | Timestamp (format 1) |
| C_HOUR2 | String? | Timestamp (format 2) — used for ordering |
| C_SPEED | Int? | Speed at this point |
| C_LAP | Int? | Lap number |
| C_TRANSPONDER_NUM | String? | Transponder identifier |
| C_TRANSPONDER_INFOS | Int? | Transponder flags |
| C_INFO1 | Int? | Additional info |
| C_INFO2 | Int? | Additional info |

---

## Heat Table Relationship

```
TTIMEINFOS_HEAT1  TTIMEINFOS_HEAT2  ...  TTIMEINFOS_HEAT9
    |                   |                       |
    C_NUM (PK)         C_NUM (PK)             C_NUM (PK)
    C_STATUS           C_STATUS                C_STATUS
    C_TIME             C_TIME                  C_TIME
    C_INTER1           C_INTER1                C_INTER1
    C_INTER2           C_INTER2                C_INTER2
         \                  |                  /
          \                 |                 /
           +----------------+-----------------+
                            |
                    TCOMPETITORS (Event DB)
                       C_NUM → joins on competitor number
```

---

## Sector Time Calculation

Raw timing data provides cumulative split times. Sector times are derived:

```
                    |<----- C_INTER1 ------>|
                    |<----------- C_INTER2 ----------->|
                    |<--------------------- C_TIME ----------------------->|
  START |-----------+---------------------------+---------------------------| FINISH
        |           |                           |                           |
        |  Sector 1 |        Sector 2           |        Sector 3           |
        |<- split1->|<-- split2 - split1 ------>|<-- time - split2 -------->|

sector1 = C_INTER1
sector2 = C_INTER2 - C_INTER1
sector3 = C_TIME   - C_INTER2
finish  = C_TIME
```

In code (`shared/src/logic/functions.ts`):
```typescript
export function calculateTimes(times: TimeInfo): Times {
  return {
    sector1: times.split1,
    sector2: times.split2 - times.split1,
    sector3: times.time - times.split2,
    finish: times.time,
  }
}
```

---

## How Each Endpoint Uses the Database

### `competitors.list` (tRPC) and `GET /api/simple/competitors.json`

1. Reads all rows from `TCOMPETITORS` (Event DB)
2. Reads all rows from `TTIMEINFOS_HEAT1` through `TTIMEINFOS_HEAT9` (EventData DB)
3. Joins timing rows to competitors by `C_NUM`
4. Maps DNF/DSQ runs to `{ time: 0, split1: 0, split2: 0 }`
5. Calculates personal best sectors for each competitor
6. Sorts by best finish time ascending
7. Assigns outright position (only to competitors with at least one valid time)

### `currentcompetitor.number` (tRPC) and `GET /api/simple/currentCompetitor.json`

1. Reads `TPARAMETERS` from Online DB to get current heat number (`C_PARAM='HEAT'`)
2. Queries `TTIMERECORDS_HEAT{n}_INTER1` for rows where `C_STATUS` is `0` or `65536` and `C_NUM != 0`
3. Orders by `C_HOUR2` descending, takes the first result
4. Returns the competitor number (`C_NUM`) of the most recently active competitor

**Why INTER1?** The intermediate 1 timing point is the first sensor a competitor passes, making it the earliest indicator that a competitor is on course.

### `runs.count` (tRPC) and `GET /api/simple/runs.json`

1. Reads `TPARAMETERS` from Online DB where `C_PARAM='HEAT'`
2. Returns the integer value as the current heat/run number

### `config.get` (tRPC)

1. Reads `TPARAMETERS` from Event DB where `C_PARAM='DATE'` and `C_PARAM='TITLE2'`
2. Converts Excel serial date to ISO date string
3. Returns combined with values from `config.json`

---

## Prisma Client Initialization

`server/src/dbUtils.ts` creates three separate Prisma clients per event:

```typescript
export function getEventDatabases(eventId: string): EventDB {
  const eventPath = config.eventDatabasePath

  // Online DB is optional — gracefully handles missing/empty file
  let online: EventDB['online'] = null
  if (existsSync(onlineDbPath) && statSync(onlineDbPath).size > 0) {
    online = new pcOnline({ datasources: { db: { url: `file:${onlineDbPath}` } } })
  }

  return {
    online,
    event:     new pcEvent({ ... }),      // Event{id}.scdb
    eventData: new pcEventData({ ... }),  // Event{id}Ex.scdb
  }
}
```

The `EventDB` type is:
```typescript
type EventDB = {
  event: PrismaClient       // competitor data
  eventData: PrismaClient   // timing data
  online: PrismaClient | null  // live state (optional)
}
```
