# Deployment

## Prerequisites

- Docker and Docker Compose installed on the host machine
- Msport Pro software running on the same machine (or network-accessible path to its database files)
- (Optional) SSH access to a web server for live-timing uploads

---

## Docker Compose Setup

The `docker-compose.yml` at the project root defines one service:

```yaml
version: '3'

services:
  core:
    restart: always
    image: 'ghcr.io/event-cell/core:main'
    ports:
      - '80:80'
    volumes:
      - type: bind
        source: "${CORE_DATA}"
        target: /data
      - type: bind
        source: "${TIMING_DB}"
        target: /app/prisma/Events

```

### Environment Variables

Create a `.env` file in the same directory as `docker-compose.yml`:

```env
# Path to persistent data directory (config, results, SSH keys)
CORE_DATA=/home/user/event-cell-data

# Path to the directory containing Msport Pro .scdb database files
TIMING_DB=/path/to/msport/events
```

On Windows with Msport Pro, `TIMING_DB` might be something like:
```env
TIMING_DB=C:\Users\User\Documents\MSport Pro\Events
```

### Starting the Container

```bash
docker compose up -d
```

The container will:
1. Start Express on port 80
2. Read `config.json` from `/data/config.json` (creating it if absent)
3. Run scheduled tasks immediately, then every minute
4. Serve the React SPA at `http://localhost`

### Stopping

```bash
docker compose down
```

---

## Volume Mount Setup

### /data Volume

This directory is persisted across container restarts and contains:
- `config.json` — event configuration
- `results/` — any generated result files
- `live-timing/` — staging area for JSON files before rsync
- `.ssh/id_rsa` — SSH private key for rsync (if using live timing upload)

### /app/prisma/Events Volume

Points to the directory where Msport Pro writes its `.scdb` files. Mounted **read-write**, because the
server owns `Speeds.db` in the same directory — see [Configuration](configuration.md). The server
never writes to the `.scdb` files themselves; if you would rather keep the directory read-only,
bind-mount `Speeds.db` on its own as read-write instead.

The files expected:
- `Online.scdb` — updated live during the event
- `Event{id}.scdb` — competitor registrations
- `Event{id}Ex.scdb` — timing data

---

## SSH Key Setup for Live Timing

If you want to push results to a live-timing website:

1. Generate a key pair on the host:
   ```bash
   ssh-keygen -t rsa -b 4096 -f ~/event-cell-data/.ssh/id_rsa -N ""
   ```

2. Copy the public key to your web server:
   ```bash
   ssh-copy-id -i ~/event-cell-data/.ssh/id_rsa.pub user@your-web-server.com
   ```

3. Configure `config.json`:
   ```json
   {
     "rsyncSshKeyPath": "/data/.ssh/id_rsa",
     "rsyncRemoteHost": "your-web-server.com",
     "rsyncRemoteUser": "ubuntu",
     "rsyncRemotePath": "/var/www/html"
   }
   ```

4. Enable upload from the admin page (check **Upload Live Timing**).

---

## GitHub Actions CI/CD

The project includes a GitHub Actions workflow that:

1. Builds the Docker image on push to `main`
2. Pushes it to the GitHub Container Registry (`ghcr.io/event-cell/core:main`)

To pull the latest image on your server:
```bash
docker compose pull
docker compose up -d
```

---

## Building Locally

```bash
# Build the Docker image locally
./build-local.sh

# Or manually:
docker build -t event-cell-core:local .
```

For local development without Docker, see [development.md](./development.md).

---

## CLI Client

The `cli-client` workspace provides batch processing utilities:

```bash
cd cli-client
yarn event-cell-cli process-events
```

This is used for offline batch operations on event data outside the normal Docker workflow. See the `cli-client/` source for available commands.
