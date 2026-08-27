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

### Config location for native runs

Outside a container there is no `/data/`, so point the server at the seeded config with
`CONFIG_DIR`:

```bash
CONFIG_DIR=$(pwd)/test-data yarn server:dev
```

See [Configuration](configuration.md) for how the path is resolved.

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

`yarn server:setup` runs `prisma generate` for all four schema files, producing TypeScript clients in `server/src/prisma/generated/`.

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

The four schema files and their outputs:

| Schema file | Output directory | Used for |
|-------------|-----------------|---------|
| `schemaOnline.prisma` | `generated/online/` | Online.scdb |
| `schemaEvent.prisma` | `generated/event/` | Event{id}.scdb |
| `schemaEventData.prisma` | `generated/eventData/` | Event{id}Ex.scdb |

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

The server build copies the client bundle into `server/dist/server/ui/` so that Express can serve it as static files. This is how the single-port architecture works in production.

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
