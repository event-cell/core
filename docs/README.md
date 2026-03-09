# Event Cell Core — Documentation

Event Cell Core is a Docker-containerized real-time timing display system. It connects to Msport Pro timing software (using TAG transponder devices) via SQLite databases, and serves multiple live display boards for events such as motorkhanas and autocross competitions.

## Table of Contents

| File | Description |
|------|-------------|
| [architecture.md](./architecture.md) | System overview, component diagram, technology stack, data flow |
| [database.md](./database.md) | Deep-dive: all DB tables, schemas, queries, field mappings |
| [display-boards.md](./display-boards.md) | Each board type: URL, purpose, layout, refresh rates |
| [admin-guide.md](./admin-guide.md) | Admin page walkthrough, config options, end-of-day results |
| [configuration.md](./configuration.md) | config.json reference, Docker volumes, environment variables |
| [points-system.md](./points-system.md) | Tri-Series points calculation rules and display |
| [deployment.md](./deployment.md) | Docker Compose setup, SSH/rsync for live timing |
| [api-reference.md](./api-reference.md) | tRPC endpoints and simple JSON API |
| [live-timing-website.md](./live-timing-website.md) | Public live-timing site: architecture, data flow, features |
| [development.md](./development.md) | Monorepo setup, workspaces, dev workflow, build process |

## Quick Reference: Display URLs

| URL | Purpose | Location |
|-----|---------|----------|
| `/display/1` | Competitor leaderboard — board 1 | Cafe |
| `/display/2` | Competitor leaderboard — board 2 | Cafe |
| `/display/3` | Competitor leaderboard — board 3 | Cafe |
| `/display/4` | Competitor leaderboard — board 4 | Cafe |
| `/trackdisplay` | Live sector times for current competitor | Trackside |
| `/announcer` | Competitor info + class leaderboard + points | Announcer desk |
| `/admin` | Configuration and end-of-day results | Staff only |
