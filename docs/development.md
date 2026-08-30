# Development Guide

## Prerequisites

- Node.js 22+
- Yarn 4 (`corepack enable` then `corepack prepare yarn@4 --activate`)
- Access to Msport Pro `.scdb` files (or sample files from `samples/`)

---

## Development Environment (Fedora 38 VM)

Docker cannot run on the macOS workstation: that macOS install is itself a VM guest, and
nested virtualisation is only offered to Linux guests, never to macOS guests. Every
Docker-on-macOS option (Colima, Docker Desktop, Rancher, OrbStack, `podman machine`,
Apple's `container`) is built on Virtualization.framework or Hypervisor.framework, so none
of them can start there. Development therefore happens on a Linux VM, where containers are
a plain kernel feature and need no nested virtualisation at all.

**VM spec:** Fedora 38, ≥4 vCPU, 8 GB RAM, 40 GB disk (`node_modules/` alone is ~560 MB
before Docker images).

### One-command setup

```bash
git clone <repo-url> core && cd core
./setup-linux.sh
```

`setup-linux.sh` installs Node 22 (via `nvm`), Yarn 4 (via `corepack`), Docker CE, the base
build tools and the project dependencies, generates the Prisma clients, and seeds a
development config. It is idempotent, so it is safe to re-run.

Afterwards, log out and back in (or run `newgrp docker`) so your shell picks up the `docker`
group.

### Things to know

- **Fedora 38 is EOL**, so its mirrors have moved to the Fedora archive. If `dnf` cannot
  refresh its metadata, the setup script offers to repoint the base and updates repos at
  `https://dl.fedoraproject.org/pub/archive/fedora/linux/`, backing up the originals first.
- **SELinux is enforcing.** `test-docker.sh` passes `:z` on its bind mounts so the container
  can read them. Do not disable SELinux to work around mount errors.
- **firewalld.** To reach the test container from other machines:
  `sudo firewall-cmd --add-port=3000/tcp --permanent && sudo firewall-cmd --reload`
- **Event databases are not in git.** `Events/` and `test-data/` are gitignored, so copy the
  `.scdb` files across from the workstation:
  `rsync -av <mac-user>@<mac-host>:~/IdeaProjects/core/Events/ ./Events/`

### Two configs: container vs native

The paths inside a config file are only valid in one place at a time, so `setup-linux.sh` seeds
two of them:

| File | Used by | Paths |
|------|---------|-------|
| `test-data/config.json` | `test-docker.sh` — mounted as `/data`, read as `/data/config.json` inside the container | Container: `/app/prisma/Events`, `/data/records`, `/data/live-timing` |
| `dev-config/config.json` | Native runs via `CONFIG_DIR` | Host: `<repo>/Events`, `<repo>/test-data/...` |

Outside a container there is no `/data/`, so point the server at the native config with
`CONFIG_DIR`:

```bash
CONFIG_DIR=$(pwd)/dev-config yarn server:dev
```

**Do not put host paths in `test-data/config.json`.** The container cannot see them, and Prisma
fails with `Error code 14: Unable to open the database file` even though the bind mounts are
correct. Verify a mount with `docker exec <container> ls -la /app/prisma/Events`.

See [Configuration](configuration.md) for how the path is resolved.

### Checking a display renders

The boards are only really verified by looking at them, so two scripts do that
headlessly. `scripts/fake-radar.mjs` is a dependency-free WebSocket server speaking the
radar's protocol, with `/mode?mode=hold|idle|cycle` to hold a pass open or end it.
`scripts/check-trackdisplay.mjs` drives Chromium (Playwright) against a running server and
asserts what the board actually paints, with screenshots written to `$SHOT_DIR`.

`scripts/fake-broker.mjs` does the same job for the MQTT source: a local broker plus a
publisher, with `/publish?speed=&daySecs=&time=` for one reading and `/burst?count=` for a
backlog arriving at once. Passing an explicit `time` republishes a byte-identical message, which
is how a broker redelivery is tested.

```bash
node scripts/fake-broker.mjs         # mqtt://127.0.0.1:1883, control on :1884
yarn fake-radar                      # terminal 1: ws://127.0.0.1:8899/ws/radar1-slow/
# point speedMonitorUrl at it, start the server or container, then:
yarn check:display http://localhost:3002
```

It asserts the speed and `kph` appear while a pass is open, and that both are gone once it
ends while the rest of the board still renders. Playwright needs its browser once:
`npx playwright install chromium`.

Note that jsdom cannot be used for this: it silently ignores `<script type="module">`, which
is what Vite emits, so the page never executes and the root element stays empty.

---

## Monorepo Structure

The project uses Yarn Workspaces. The five workspaces are:

| Workspace | Description |
|-----------|-------------|
| `server/` | Express + tRPC backend, Prisma clients, scheduled tasks |
| `client/` | React SPA (display boards + admin) |
| `shared/` | Pure logic and shared React components used by both client and server |
| `live-timing/` | Separate React app for the public live-timing website |
| `cli-client/` | CLI tool for batch event processing |

Dependencies are hoisted to the root `node_modules/` in the Docker image (`NODE_PATH=/app/node_modules`).

---

## Setup

```bash
# Install all workspace dependencies
yarn install

# Generate Prisma clients (required after schema changes or fresh clone)
yarn server:setup
```

`yarn server:setup` runs `prisma generate` for every schema file, producing TypeScript clients in `server/src/prisma/generated/`.

---

## Development Workflow

### Running the backend

```bash
yarn server:dev
```

This starts the Express server with hot-reloading (via `tsx`). The server will look for `.scdb` files at the path configured in `config.json`.

For local dev without Docker, you can point `eventDatabasePath` at a local copy of the database files or the sample files in `samples/`.

### Running the frontend

```bash
yarn client:dev
```

Starts the Vite dev server (usually on port 5173). The frontend proxies API requests to the Express server.

### Running both together

Open two terminals:
```bash
# Terminal 1
yarn server:dev

# Terminal 2
yarn client:dev
```

---

## Prisma Client Generation

If you change any `.prisma` schema file, regenerate the clients:

```bash
cd server && yarn prisma generate
```

Or re-run the full setup:

```bash
yarn server:setup
```

The schema files and their outputs:

| Schema file | Output directory | Used for |
|-------------|-----------------|---------|
| `schemaOnline.prisma` | `generated/online/` | Online.scdb |
| `schemaEvent.prisma` | `generated/event/` | Event{id}.scdb |
| `schemaEventData.prisma` | `generated/eventData/` | Event{id}Ex.scdb |
| `schemaRecords.prisma` | `generated/records/` | records.sqlite |
| `schemaSpeeds.prisma` | `generated/speeds/` | Speeds.db — radar speeds |

---

## The `ui-shared` Alias

The client workspace uses a Vite path alias `ui-shared` that maps to `shared/src/`. This allows the client to import shared components and logic without relative paths:

```typescript
import { calculateTimes, getSectorColors } from 'ui-shared'
import { Theme } from 'ui-shared'
```

This alias is configured in `client/vite.config.ts`.

---

## Build Process

```bash
# Build everything
yarn build

# Or individually:
yarn client:build    # Vite → client/dist/
yarn server:build    # tsc → server/dist/
```

**Neither build copies the client bundle into `server/dist/server/ui/`** — only
`yarn workspace client build:server-ui` does, and Express serves the display pages from there.
Without that step the server answers `/`, `/display` and `/admin` with
`504 The UI has not been built with the server`, while the API keeps working:

```bash
yarn workspace client build:server-ui   # client → server/dist/server/ui/
```

Since `Dockerfile` copies the pre-built output rather than building, an image is only as
current as the last build — always `yarn build` before `docker build`, or it silently ships
stale code.

---

## Docker Image Build

```bash
# Build and tag locally
./build-local.sh

# Or with Docker directly
docker build -t event-cell-core:dev .
```

The `Dockerfile` uses a single-stage Node 22 Alpine image:
1. Copies the pre-built project (controlled by `.dockerignore`)
2. Sets `NODE_PATH=/app/node_modules` and `PORT=80`
3. Runs `node ./server/dist/server/index.js`

The image does **not** run `yarn build` — the project must be built before building the Docker image.

## Testing a Container

| Script | Image | Use for |
|--------|-------|---------|
| `./test-docker.sh` | builds `event-cell-core:local` | testing your working tree |
| `./test-registry.sh` | pulls `ghcr.io/event-cell/core:main` | testing what the nightly workflow published |

Both mount `Events/` and `test-data/` and publish port 3000 identically, so the only difference
is which image runs. `test-registry.sh` always pulls, and prints the digest and build time of the
image it is about to run so there is no doubt which build is under test. Override the image with
`IMAGE=ghcr.io/event-cell/core:some-tag ./test-registry.sh`.

**Both stop whatever is already published on port 3000**, so take care when something else is
serving there.

---

## TypeScript Configuration

- `tsconfig.base.json` at the root defines shared compiler options
- Each workspace extends the base config
- Path aliases (`server/src/router/objects.js` etc.) are configured at the workspace level

---

## Linting

```bash
yarn lint
```

Uses ESLint with TypeScript and React plugins.
