# API Reference

The server exposes two API surfaces: a tRPC API for the frontend, and simple JSON endpoints for external consumers (including the live-timing website scheduled task).

---

## tRPC API

Base path: `POST /api/v1/`

tRPC uses HTTP batch requests. All procedures are accessed by the React frontend via the `trpc` client created in `client/src/App.tsx`.

### `competitors.list`

| Property | Value |
|----------|-------|
| Type | Query |
| Input | None |
| Returns | `Competitor[]` |

Returns all competitors with their timing data joined, sorted by best finish time ascending. Each competitor has an `outright` position assigned (only competitors with at least one valid time get a positive position).

**Competitor shape:**
```typescript
{
  number: number        // Car number
  firstName: string     // First name
  lastName: string      // Last name
  class: string         // Class name (from C_I29 or C_SERIE)
  classIndex: number    // Numeric class ID (from C_I21)
  vehicle: string       // Vehicle (from C_COMMITTEE)
  classRecord: string   // Class record time string (from C_TEAM)
  club?: string         // Club name (from C_CLUB)
  special?: string      // Special category e.g. "Lady", "Junior" (from C_I28)
  miscAward?: string    // Misc award field (from C_I30)
  times: TimeInfo[]     // All runs across all heats
  outright: number      // Outright position (-1 if no valid time)
}
```

**TimeInfo shape:**
```typescript
{
  run: number    // Heat number (1–9)
  status: number // 0=finished, 2=DNF, 3=DSQ, 65536=on course
  time: number   // Finish time in milliseconds (0 for DNF/DSQ)
  split1: number // Intermediate 1 in milliseconds
  split2: number // Intermediate 2 in milliseconds
}
```

---

### `currentcompetitor.number`

| Property | Value |
|----------|-------|
| Type | Query |
| Input | None |
| Returns | `number` |

Returns the car number of the competitor most recently detected at the INTER1 timing point in the current heat. Returns `1` if no competitor is detected or if the online database is unavailable.

---

### `runs.count`

| Property | Value |
|----------|-------|
| Type | Query |
| Input | None |
| Returns | `number` |

Returns the current heat number from the Online database. Used by display boards to know which heat is active.

---

### `config.get`

| Property | Value |
|----------|-------|
| Type | Query |
| Input | None |
| Returns | Config object |

Returns the current configuration including event metadata (event ID, event name, event date from DB, refresh intervals, display distribution settings).

---

### `config.set`

| Property | Value |
|----------|-------|
| Type | Mutation |
| Input | Partial config fields (eventId, eventName, uploadLiveTiming) |
| Returns | Updated config object |

Updates event configuration and persists to `config.json`.

---

### `config.getDisplayDistribution`

| Property | Value |
|----------|-------|
| Type | Query |
| Input | None |
| Returns | `{ maxRowsPerDisplay: number }` |

---

### `config.setDisplayDistribution`

| Property | Value |
|----------|-------|
| Type | Mutation |
| Input | `{ maxRowsPerDisplay: number }` |
| Returns | `{ maxRowsPerDisplay: number }` |

---

### `config.getRefreshIntervals`

| Property | Value |
|----------|-------|
| Type | Query |
| Input | None |
| Returns | Refresh intervals object |

---

### `config.setRefreshIntervals`

| Property | Value |
|----------|-------|
| Type | Mutation |
| Input | Refresh intervals object |
| Returns | Updated refresh intervals object |

---

### `endofdayresults.generate`

| Property | Value |
|----------|-------|
| Type | Query |
| Input | None |
| Returns | `{ xlsx: string }` (base64-encoded Excel file) |

Generates and returns the end-of-day results Excel file. Note: this endpoint is not yet protected by authentication (marked as TODO in the source).

---

## Simple JSON API

These plain GET endpoints serve the same data as selected tRPC queries, in a format suitable for external consumers.

| URL | Description | Response |
|-----|-------------|---------|
| `GET /api/simple/competitors.json` | Full competitor list | `Competitor[]` (same shape as tRPC) |
| `GET /api/simple/currentCompetitor.json` | Current competitor number | `number` |
| `GET /api/simple/runs.json` | Current heat number | `number` |

These endpoints are polled by the scheduled task to generate the JSON files that are rsynced to the live-timing website.

---

## Scheduled Task Output Files

The scheduled task (runs every minute when `uploadLiveTiming` is enabled) generates these files and rsyncs them to the remote web server:

| File | Contents | Remote path |
|------|----------|-------------|
| `competitors.json` | Full `Competitor[]` array | `/{YYYY-MM-DD}/api/simple/` |
| `currentCompetitor.json` | Current competitor number | `/{YYYY-MM-DD}/api/simple/` |
| `runs.json` | Current heat number | `/{YYYY-MM-DD}/api/simple/` |

The same files are also copied to `/live-timing/api/simple/` on the remote server for use by the "current event" display link.
