// Minimal MQTT broker plus a radar publisher, so the MQTT path can be exercised
// without the real broker. Publishes on `radar/speed` in the harness's format.
//
//   node scripts/fake-broker.mjs [port]
//   curl "http://127.0.0.1:<port+1>/publish?speed=118.4&daySecs=45123"   one reading
//   curl "http://127.0.0.1:<port+1>/burst?speed=95&daySecs=45123&count=5" a backlog
import { createServer } from 'net'
import { createServer as createHttp } from 'http'
import { Aedes } from 'aedes'

const PORT = Number(process.argv[2] || 1883)
const aedes = await Aedes.createBroker()

createServer(aedes.handle).listen(PORT, () =>
  console.log(`fake broker on mqtt://127.0.0.1:${PORT}`),
)

aedes.on('client', (c) => console.log(`client connected: ${c.id}`))
aedes.on('subscribe', (subs, c) =>
  console.log(`${c.id} subscribed: ${subs.map((s) => s.topic).join(', ')}`),
)

const publish = (speed, daySecs, time = Math.floor(Date.now() / 1000)) => {
  const payload = `Time: ${time} MaxSpeed: ${speed} Day_secs: ${daySecs}`
  aedes.publish({ topic: 'radar/speed', payload, qos: 0, retain: false }, () => {})
  console.log(`published: ${payload}`)
  return payload
}

createHttp((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const speed = Number(url.searchParams.get('speed') || 118.4)
  const daySecs = Number(url.searchParams.get('daySecs') || 45123)

  if (url.pathname === '/publish') {
    // An explicit time makes a byte-identical republish possible, which is what
    // a broker redelivery looks like
    const time = url.searchParams.get('time')
    res.end(publish(speed, daySecs, time ? Number(time) : undefined) + '\n')
  } else if (url.pathname === '/burst') {
    // A backlog arriving at once, as it would after the network returns
    const count = Number(url.searchParams.get('count') || 3)
    const base = Math.floor(Date.now() / 1000)
    for (let i = 0; i < count; i++) publish(speed + i, daySecs + i, base + i)
    res.end(`published ${count}\n`)
  } else {
    res.statusCode = 404
    res.end('not found\n')
  }
}).listen(PORT + 1, () => console.log(`control on http://127.0.0.1:${PORT + 1}/publish`))
