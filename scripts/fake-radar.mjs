// Minimal RFC6455 server speaking the radar's protocol, for testing without the
// real radar. HTTP control endpoints hold a pass open or close it, so the
// display can be inspected in a known state.
import { createServer } from 'http'
import { createHash } from 'crypto'

const PORT = Number(process.argv[2] || 8899)
const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'

const frame = (text) => {
  const payload = Buffer.from(text, 'utf8')
  if (payload.length > 125) throw new Error('test frames stay short')
  return Buffer.concat([Buffer.from([0x81, payload.length]), payload])
}

const sockets = new Set()
const IDLE = 'S0.0 M0.0 C0.0 N0 T0 P0.0\n'

// 'cycle' replays a whole pass; 'hold' keeps one pass open; 'idle' closes it
let mode = 'hold'
let held = { max: 118.4, n: 40 }

const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  if (url.pathname === '/mode') {
    mode = url.searchParams.get('mode') || mode
    if (url.searchParams.get('max')) held = { ...held, max: Number(url.searchParams.get('max')) }
    if (mode === 'hold') held.n = 40
    res.end(`mode=${mode} max=${held.max}\n`)
    console.log(`mode -> ${mode} (max ${held.max})`)
    return
  }
  res.statusCode = 404
  res.end('not found\n')
})

server.on('upgrade', (req, socket) => {
  const key = req.headers['sec-websocket-key']
  const accept = createHash('sha1').update(key + GUID).digest('base64')
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
      'Upgrade: websocket\r\nConnection: Upgrade\r\n' +
      `Sec-WebSocket-Accept: ${accept}\r\n\r\n`,
  )
  sockets.add(socket)
  socket.on('close', () => sockets.delete(socket))
  socket.on('error', () => sockets.delete(socket))
  socket.on('data', () => {})
  console.log('client connected')
})

server.listen(PORT, () => console.log(`fake radar ws://127.0.0.1:${PORT}/ws/radar1-slow/`))

const send = (line) => {
  for (const s of sockets) { try { s.write(frame(line)) } catch {} }
}

const cycle = [
  IDLE, IDLE,
  'S88.2 M88.2 C88.2 N12 T24 P0.0\n',
  'S104.6 M104.6 C104.6 N40 T80 P0.0\n',
  'S118.4 M118.4 C118.4 N71 T142 P0.0\n',
  'S52.0 M118.4 C52.0 N92 T184 P0.0\n',
  IDLE, IDLE,
]
let i = 0

setInterval(() => {
  if (mode === 'idle') return send(IDLE)
  if (mode === 'hold') {
    // N keeps climbing so the client sees one continuous pass
    held.n += 3
    const m = held.max.toFixed(1)
    return send(`S${m} M${m} C${m} N${held.n} T${held.n * 2} P0.0\n`)
  }
  send(cycle[i++ % cycle.length])
}, 2000)
