# Public Live-Timing Website

## Overview

The live-timing website is a separate static React application hosted on an internet-facing server. Competitors and spectators access it from their phones and computers to follow results in real time.

Key characteristics:
- **No backend** — purely client-side React consuming pre-generated JSON files
- **Static hosting** — can run on any web server (nginx, Apache, S3, etc.)
- **Two entry points:** main site (`/`) and personal history (`/personal-history`)
- **Populated by rsync** — Event Cell Core pushes JSON files to the server every minute

---

## Full System Data Flow

```
TAG Timing Devices (transponders)
        |
        v
Msport Pro Software (Windows PC, on-site)
        | writes .scdb files
        v
SQLite .scdb files ←── read-only Docker volume mount
        |
        v
Event Cell Core (Docker Container)
  |
  ├── tRPC/simple API (serves display boards on local network)
  |
  └── Scheduled Task (every 1 minute, when uploadLiveTiming=true)
        |
        ├── Reads competitors, current competitor, heat number
        ├── Writes JSON files to local staging directory
        |     competitors.json
        |     currentCompetitor.json
        |     runs.json
        |
        └── rsync over SSH → Internet Web Server
              |
              ├── /{YYYY-MM-DD}/api/simple/competitors.json
              ├── /{YYYY-MM-DD}/api/simple/currentCompetitor.json
              ├── /{YYYY-MM-DD}/api/simple/runs.json
              ├── /live-timing/api/simple/*.json  (same files, "current event" alias)
              └── /{YYYY-MM-DD}/display/  (client app bundle)
                        |
                        v
              Live-Timing React App
              (fetched and rendered by competitors' browsers/phones)
```

---

## Hosted File Structure on Web Server

```
/ (web root)
├── index.html                    ← Main app entry point
├── personal-history.html         ← Personal history page entry point
├── assets/                       ← JS, CSS bundles
│
├── site-metadata.json            ← Master event index
│     {
│       "eventDirectories": ["2024-01-15", "2024-02-10", ...],
│       "metadataMap": {
│         "2024-01-15": {
│           "eventName": "SDMA Spring Motorkhana 2024",
│           "eventId": "001",
│           "isCurrentEvent": false,
│           "lastUpdated": "2024-01-15T14:30:00Z"
│         },
│         ...
│       }
│     }
│
└── {YYYY-MM-DD}/                 ← One directory per event date
    ├── metadata.json             ← Per-event metadata (eventName, eventId, lastUpdated)
    ├── display/                  ← Client app bundle (index.html + assets)
    │   ├── index.html
    │   └── assets/
    └── api/
        └── simple/
            ├── competitors.json      ← Competitor[] array with all timing data
            ├── currentCompetitor.json
            └── runs.json
```

---

## Routes

| URL | Page | Description |
|-----|------|-------------|
| `/` | Landing page | "Live Timing" and "Personal History" buttons + event list |
| `/live-timing` | Event list | Historical events only |
| `/live-timing/display/` | Live display | Links to current event's display app |
| `/personal-history` | Personal history | Driver name search across all events |

---

## Landing Page

The landing page (`live-timing/src/App.tsx` route `/`) shows:

1. A large **"Live Timing"** button that links to `/live-timing/display/` (the current event's display, rsynced alongside data files)
2. A large **"Personal History"** button that navigates to `/personal-history`
3. A historical event list (`EventList` component) loaded from `site-metadata.json`

Events in the list link to `/{date}/display/` for that event's static display app.

---

## Event Browsing

The `EventList` component groups events by year in collapsible sections (newest year first). Each event shows:
- Formatted date (e.g., "Monday, January 15, 2024")
- Event name from `site-metadata.json`
- Link to `/{date}/display/` — the static display for that event

All metadata is loaded from `site-metadata.json` on page load.

---

## Personal History Search

**Source:** `live-timing/src/pages/PersonalHistoryPage.tsx`, `live-timing/src/workers/searchWorker.ts`

On page load, the app fetches `competitors.json` for every event listed in `site-metadata.json` and loads all competitor data into memory.

### Search Flow

1. User types a driver name (first, last, or both, any order) and presses Enter or clicks Search
2. Search is dispatched to a **Web Worker** (off the main thread — no UI freeze)
3. The worker performs case-insensitive, partial-match, word-order-independent name matching
4. Results are returned to the main thread and rendered

### Personal Best Calculation

The app calculates two separate personal best summaries:

**Single-lap events** — events where the name does NOT match the two-lap regex
**Two-lap events** — events where the name matches: `/2\s+lap|2-lap|two\s+lap/i`

For each type, the personal best summary shows:
- Best time across all events of that type
- Best sector 1, sector 2, sector 3 (each taken independently from any event/run)
- Theoretical best time (sum of best S1 + S2 + S3)
- Which event the best time came from

### Per-Event Results

Each matching event shows a table with:
- Driver name, number, vehicle, class
- Best valid time for that event
- Link to full event results (`/{date}/display/`)

---

## Deployment Process

**Source:** `live-timing/scripts/deploy.ts`

The live-timing app itself (HTML, JS, CSS) is deployed separately from the data files:

1. `yarn build` compiles the React app
2. `rsync` pushes the built assets to the web server root

Requires a `web-deploy-config.json` file at the repository root with SSH/rsync credentials.

The ongoing data updates (competitors.json, etc.) are handled by the Event Cell Core scheduled task — no manual deploy step needed during an event.

---

## competitors.json Data Format

The `competitors.json` file is a `Competitor[]` array. Each entry:

```json
{
  "number": 17,
  "firstName": "John",
  "lastName": "Smith",
  "class": "Open 2WD",
  "classIndex": 3,
  "vehicle": "EG Civic",
  "classRecord": "58.32",
  "club": "SDMA",
  "special": null,
  "miscAward": null,
  "outright": 1,
  "times": [
    {
      "run": 1,
      "status": 0,
      "time": 61450,
      "split1": 18200,
      "split2": 38900
    },
    {
      "run": 2,
      "status": 0,
      "time": 59830,
      "split1": 17600,
      "split2": 38100
    }
  ]
}
```

All time values are in **milliseconds**.

Sector times are derived the same way as in the core system:
- Sector 1 = `split1`
- Sector 2 = `split2 - split1`
- Sector 3 = `time - split2`

---

## site-metadata.json Format

```json
{
  "eventDirectories": ["2024-01-15", "2024-02-10"],
  "metadataMap": {
    "2024-01-15": {
      "eventName": "SDMA Spring Motorkhana",
      "eventId": "001",
      "isCurrentEvent": false,
      "lastUpdated": "2024-01-15T14:30:00Z"
    }
  }
}
```

This file is regenerated by the scheduled task when event metadata changes, using SSH to check timestamps on the remote server to avoid unnecessary regeneration.
