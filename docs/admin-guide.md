# Admin Guide

## Accessing the Admin Page

Navigate to `/admin` in any browser on the local network while the Docker container is running. There is currently no authentication — the page is accessible to anyone who can reach the server.

---

## Event Configuration

**Fields:**

| Field | Description |
|-------|-------------|
| Event ID | The numeric suffix of the Msport Pro database files (e.g., `"001"` for `Event001.scdb`). Change this to switch which event's database is read. |
| Event Name | Automatically populated from the `TITLE2` parameter in the event database. Read-only in the UI — it is refreshed from the DB when the page loads. |

After changing the Event ID, click **Save Event Configuration** to apply the change. The server will switch to reading the new event's database files immediately.

---

## Live Timing Settings

**Upload Live Timing** checkbox: when checked, enables the scheduled task that pushes JSON data files to the remote live-timing website via rsync every minute.

Note: This setting is **forced to `false` on server startup** regardless of what is stored in `config.json`. It must be explicitly enabled each event day. This prevents accidental data uploads from previous events.

---

## Display Configuration

### Maximum Rows Per Display

A slider (range: 15–30, default: 20) that controls how many rows each of displays 1–3 can hold before classes overflow to display 4.

- A class occupies 1 header row + 1 row per driver
- Increasing this value allows more competitors per screen
- Decreasing it pushes more classes to display 4

Click **Save Display Configuration** to persist.

---

## Speed Monitoring

| Field | Default | Description |
|-------|---------|-------------|
| Radar Monitor URL | `http://radar1.local/radar/two.html` | The radar's status page; its host is used to reach the speed WebSocket |

Below the field is a live connection status, polled every 5 seconds: green when the
server is connected to the radar, amber when it is not, with the derived socket URL and
the time of the last reading. Use it to confirm the radar is reachable before an event.

The value is saved with the rest of the event configuration (**Save**), and the server
reconnects to the new address immediately — no restart needed.

---

## Refresh Configuration

Individual sliders for each display's refresh interval:

| Setting | Range | Default | Description |
|---------|-------|---------|-------------|
| Display 1 | 1–300s | 15s | React Query refetch interval for `/display/1` |
| Display 2 | 1–300s | 15s | React Query refetch interval for `/display/2` |
| Display 3 | 1–300s | 15s | React Query refetch interval for `/display/3` |
| Display 4 | 1–300s | 5s | React Query refetch interval for `/display/4` |
| Track Display | 1–300s | 2s | React Query refetch interval for `/trackdisplay` |
| Announcer | 1–300s | 2s | React Query refetch interval for `/announcer` |
| Fallback Refresh | 60–1800s | 300s | Full page reload interval for all routes |

Click **Save Refresh Configuration** to persist.

---

## End of Day Results

Click **End of Day Results** to generate and download an Excel (`.xlsx`) file containing the class results shortlist.

### What Data Is Included

Only competitors who qualify for prize-giving are included, based on class size:

| Class size | Positions included |
|-----------|-------------------|
| 1–3 competitors | Position 1 only (class winner) |
| 4 competitors | Positions 1–2 |
| 5+ competitors | Positions 1–3 |

### Excel Column Definitions

| Column | Description |
|--------|-------------|
| Class | Class name |
| Class_posn | Position within the class |
| Time | Best time in seconds (decimal) |
| Outright | Overall outright position |
| Name | Competitor full name |
| Car | Vehicle description |
| Record | `"Record"` if this is a new class record, blank otherwise |
| Award | `"Fastest time of the day"` if applicable, blank otherwise |

**Class record detection:** If the class winner's time (formatted to 2 decimal places as a string) is less than the value stored in the `C_TEAM` field of the TCOMPETITORS table, the `Record` field is set to `"Record"`.

### How to Download

The button triggers a browser download via a base64-encoded data URI. No file is saved permanently on the server.

**Source:** `server/src/router/endOfDayResults.ts`
