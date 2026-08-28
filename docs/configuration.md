# Configuration Reference

## Config File Location

The server looks for `config.json` in the following order:

1. `$CONFIG_DIR/config.json` — if the `CONFIG_DIR` environment variable is set
2. `/data/config.json` — if the `/data/` directory exists (standard Docker volume mount)
3. `server/dist/config.json` — fallback for local development

If the config file does not exist, it is created automatically with an empty `{}` object and defaults are applied.

---

## config.json Schema

All fields are optional. Missing fields use the defaults shown below.

```jsonc
{
  // Which event database files to read (e.g., "001" → Event001.scdb + Event001Ex.scdb)
  "eventId": "001",

  // Display name for the event (also read from DB TPARAMETERS.TITLE2)
  "eventName": "Unnamed Event",

  // Path inside the container to the directory containing .scdb files
  // Usually left at the default; controlled by the Docker volume mount instead
  "eventDatabasePath": "/app/prisma/Events",

  // Path for the records SQLite database
  "recordsDatabasePath": "/data/records",

  // Whether to rsync JSON data to the live-timing website each minute
  // Always reset to false on server startup — must be explicitly enabled
  "uploadLiveTiming": false,

  // Local path where live-timing JSON files are staged before rsync
  "liveTimingOutputPath": "/data/live-timing",

  // Remote server hostname for rsync
  "rsyncRemoteHost": "example.com",

  // Remote server username for rsync SSH connection
  "rsyncRemoteUser": "ubuntu",

  // Remote path on the server where files should be placed
  "rsyncRemotePath": "/var/www/html",

  // Path to the SSH private key file (inside the container, sourced from /data volume)
  "rsyncSshKeyPath": "/data/.ssh/id_rsa",

  // Display distribution settings
  "displayDistribution": {
    // Maximum rows per display before classes overflow to display 4
    // Range: 1–∞ (UI restricts to 15–30)
    "maxRowsPerDisplay": 20
  },

  // Radar speed monitor — see "Speed Monitoring" below
  "speedMonitorUrl": "http://radar1.local/radar/two.html",
  "speedDatabasePath": "/data/speeds",

  // Refresh interval settings (all values in seconds)
  "refreshIntervals": {
    "display1": 15,        // React Query refetch for /display/1
    "display2": 15,        // React Query refetch for /display/2
    "display3": 15,        // React Query refetch for /display/3
    "display4": 5,         // React Query refetch for /display/4
    "trackDisplay": 2,     // React Query refetch for /trackdisplay
    "announcer": 2,        // React Query refetch for /announcer
    "fallbackInterval": 300 // Full page reload for all routes (min: 60, max: 1800)
  }
}
```

---

## Speed Monitoring

| Setting | Default | Description |
|---------|---------|-------------|
| `speedMonitorUrl` | `http://radar1.local/radar/two.html` | The radar's status page |
| `speedDatabasePath` | `/app/prisma/Events/Speeds.db` | The speeds database, beside the event databases |

**The socket is derived from the URL, not configured separately.** The radar publishes
speeds at `ws://<host>/ws/radar1-slow/`, so only the host of `speedMonitorUrl` matters —
`http://radar1.local/radar/two.html` becomes `ws://radar1.local/ws/radar1-slow/`. To
override the path, set `speedMonitorUrl` to a `ws://` or `wss://` URL and it is used as-is.

An internet-exposed radar is available for testing: `http://www.dd.id.au//radar/two.html`.

The server holds one connection and reconnects on its own; connections drop routinely
(observed: close code 1006 after ~9s), and an attempt that hangs without failing is
abandoned after 10s. A connection that goes silent for 120s is recycled, since the radar
emits continuously even when idle. An unreachable radar costs nothing but a blank speed
panel, so `radar1.local` being absent off-site is harmless.

### Speeds.db

The server owns `Speeds.db`, which lives with the event databases and uses the schema
that was already in service before the server took over writing it:

```sql
speeds(event, time_t, speed)          -- every pass, attributed or not
car_speeds(event, heat, car, speed)   -- best speed per competitor per heat
```

`speed` is an integer in **tenths of a km/h** (1273 = 127.3 km/h), `event` is the numeric
event id, and `time_t` is a Unix timestamp in seconds. History from before this code is
therefore still readable by the displays.

`car_speeds` is kept at one row per `(event, heat, car)`, updated when a faster pass
arrives. Its unique constraint spans the speed column too, so a blind insert would
accumulate a row per pass — reads use `MAX(speed)` grouped by car, which also copes with
the legacy rows that did.

The directory holding it must already exist — it is created one level deep at most, because
Node's recursive directory creation can spin forever on a path the kernel refuses, which would
hang the server rather than fail. A wrong path is reported once and retried every 60 seconds.

**The `Events` directory is mounted read-write** in `docker-compose.yml` for this reason.
The timing software still owns the `.scdb` files and the server never writes to them; if
you would rather keep the directory read-only, bind-mount `Speeds.db` on its own as
read-write instead. The file and tables are created on first use, and an unwritable path
simply means no speeds are recorded — the live display is unaffected.

---

## Docker Volume Mounts

Defined in `docker-compose.yml`:

```yaml
volumes:
  # Persistent data: config.json, results, live-timing staging
  - type: bind
    source: "${CORE_DATA}"      # set in your .env file
    target: /data

  # Msport Pro database files — READ ONLY
  - type: bind
    source: "${TIMING_DB}"      # set in your .env file
    target: /app/prisma/Events
    read_only: true
```

**Environment variables to set (in a `.env` file next to `docker-compose.yml`):**

| Variable | Description | Example |
|----------|-------------|---------|
| `CORE_DATA` | Directory for config and output files | `/home/user/event-cell-data` |
| `TIMING_DB` | Directory containing the Msport Pro `.scdb` files | `C:/MsportPro/Events` or `/mnt/msport/Events` |

---

## SSH Key Setup for rsync

If `uploadLiveTiming` is enabled, the server uses rsync over SSH to push files to the web server. To set this up:

1. Generate an SSH key pair on the host machine
2. Add the public key to the remote web server's `~/.ssh/authorized_keys`
3. Place the private key file inside your `CORE_DATA` directory (e.g., `/home/user/event-cell-data/.ssh/id_rsa`)
4. Set `rsyncSshKeyPath` in `config.json` to `/data/.ssh/id_rsa`

On startup, the server copies the key to `/app/.ssh/id_rsa` with `chmod 600` permissions.

---

## How Config Is Loaded

`server/src/config.ts` implements a config singleton:

1. On startup, reads the config file and parses it through a Zod schema (`ConfigType`)
2. The Zod schema uses `.deepPartial()` — all fields are optional; missing fields silently use class defaults
3. If `refreshIntervals` is missing from the file (first run), defaults are written back to disk
4. `uploadLiveTiming` is always forced to `false` on startup and written back to disk

The `config.set()` tRPC mutation (called by the admin page) updates the in-memory config object and persists the changes to disk immediately.
