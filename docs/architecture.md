# System Architecture

## Overview

Event Cell Core reads live timing data produced by Msport Pro software and distributes it to multiple browser-based display boards in real time. The system runs entirely inside a single Docker container and uses polling rather than WebSockets.

## System Diagram

```
  TAG Transponder Devices (physical hardware at start/sectors/finish)
         |
         | (wired or RF)
         v
  Msport Pro Software  (Windows PC, on-site)
         |
         | writes to SQLite files
         v
  +-----------------------------------------+
  |  /app/prisma/Events/  (read-only mount)  |
  |   Online.scdb                            |
  |   Event{id}.scdb                         |
  |   Event{id}Ex.scdb                       |
  +-----------------------------------------+
         |
         | Prisma ORM (read-only queries)
         v
  +--------------------------------------------------+
  |          Docker Container (Event Cell Core)       |
  |                                                  |
  |  Express HTTP Server (port 80)                   |
  |   ├── /api/v1/  (tRPC)                          |
  |   ├── /api/simple/*.json  (plain JSON)           |
  |   └── /  (React SPA static files)               |
  |                                                  |
  |  Scheduled Task (every 1 minute)                 |
  |   └── generates JSON files → rsync to web server|
  +--------------------------------------------------+
         |                         |
         | tRPC over HTTP          | rsync over SSH (optional)
         v                         v
  Browser Displays           Internet Web Server
  /display/1-4               (live-timing website)
  /trackdisplay
  /announcer
  /admin
```

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | 22 (Alpine) |
| HTTP server | Express | — |
| API layer | tRPC | v10 |
| Database ORM | Prisma | — |
| Database | SQLite (Msport Pro files) | — |
| Frontend framework | React | 19 |
| UI components | Material UI (MUI) | — |
| Data fetching | TanStack React Query | v5 |
| Styling/theme | MUI Theme (dark) | — |
| Monorepo tooling | Yarn Workspaces | v4 |
| Containerisation | Docker / Docker Compose | — |

## Monorepo Workspace Layout

```
core/
├── server/          # Express + tRPC backend, Prisma clients
│   └── src/
│       ├── index.ts          # Server entry point
│       ├── config.ts         # Config singleton (Zod-validated)
│       ├── dbUtils.ts        # Prisma client factory
│       ├── router/           # tRPC routers
│       ├── prisma/           # Schema files + generated clients
│       ├── scheduledTasks/   # 1-minute sync task
│       └── utils/            # Helpers, rsync
│
├── client/          # React SPA (display boards + admin)
│   └── src/
│       ├── App.tsx           # Routes
│       └── pages/            # display.tsx, trackDisplay.tsx, announcer.tsx, admin.tsx
│
├── shared/          # Code shared between client and server
│   └── src/
│       ├── components/       # Shared React components
│       └── logic/            # Pure functions (sector times, points, display split)
│
├── live-timing/     # Separate React app for the public website
│   └── src/
│       ├── App.tsx
│       ├── pages/
│       └── workers/          # Web Worker for name search
│
└── cli-client/      # CLI for batch event processing
```

## Data Flow

```
1. TAG device detects transponder
        |
2. Msport Pro records the event in SQLite
   - TTIMEINFOS_HEAT{n}: C_INTER1/C_INTER2/C_TIME/C_STATUS updated
   - TPARAMETERS (Online.scdb): C_PARAM='HEAT' updated with current heat number
        |
3. Prisma reads the SQLite files (read-only, no locking risk)
        |
4. tRPC endpoint processes the data:
   - Joins competitor metadata with timing data
   - Calculates sector times, best times, outright positions
        |
5. React Query polls the tRPC endpoint at a configurable interval
        |
6. React component re-renders the display board
```

## Polling Architecture

The system uses polling rather than WebSockets for several reasons:

- **Simplicity**: No persistent connection management needed
- **Resilience**: A stale poll simply retries; a dropped WebSocket needs reconnection logic
- **Browser compatibility**: Works on any browser without configuration
- **Display use case**: 2-second refresh is perfectly adequate for timing displays; sub-second latency is not required

Each display page has a **three-tier refresh strategy**:

1. **Primary** — React Query refetch at the configured interval (e.g., 2s for track display)
2. **Secondary** — Full `window.location.reload()` at a configurable fallback interval (default 5 minutes) to clear any accumulated memory or render issues on long-running displays
3. **Tertiary** — Error-based reload triggered on unhandled JavaScript errors or promise rejections (with a 15-second cooldown to prevent reload loops)
