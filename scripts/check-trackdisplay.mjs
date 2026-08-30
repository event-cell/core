// Loads the real track display in Chromium and asserts what it paints.
// Usage: node check-trackdisplay.mjs [baseUrl]
import { chromium } from 'playwright'

const BASE = process.argv[2] || 'http://localhost:3002'
const SHOT_DIR = process.env.SHOT_DIR || '/tmp'

const api = async (path) => (await (await fetch(`${BASE}${path}`)).json()).result.data
const radar = (mode) => fetch(`http://127.0.0.1:8899/mode?mode=${mode}`).then((r) => r.text())

let failures = 0
const expect = (name, ok, detail) => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`)
  if (!ok) failures++
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })

async function board(label, shot) {
  await page.goto(`${BASE}/trackdisplay`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)   // let the polling render settle
  await page.screenshot({ path: `${SHOT_DIR}/${shot}` })
  const text = (await page.locator('#root').innerText()).replace(/\n+/g, ' | ')
  console.log(`\n--- ${label} ---`)
  console.log(`  painted: ${JSON.stringify(text)}`)
  return text
}

// --- positive case: a pass is open, so a speed exists -----------------------
await radar('hold')
await page.waitForTimeout(4000)
const live = await api('/api/v1/speed.current')
console.log(`speed.current: ${JSON.stringify(live)}`)
if (typeof live.speed !== 'number') { console.log('no live speed to check'); process.exit(1) }

const expected = String(Math.round(live.speed))
const shown = await board(`speed present (API says ${live.speed})`, 'trackdisplay-speed.png')
expect('the rounded speed is painted', shown.includes(expected), `looking for "${expected}"`)
expect('the km/h label is painted', shown.includes('km/h'))
expect('the rest of the board is live', /[0-9]+\.[0-9]{2}/.test(shown))

// --- negative case: pass closed, so the panel must be blank -----------------
await radar('idle')
await page.waitForTimeout(6000)
const after = await api('/api/v1/speed.current')
console.log(`\nspeed.current after the pass ends: ${JSON.stringify(after)}`)
const blank = await board('pass ended', 'trackdisplay-nospeed.png')
expect('the speed is gone', !blank.includes('km/h'), 'no stale reading left on the board')
expect('the board still renders', blank.length > 0)

await browser.close()
console.log(`\n${failures === 0 ? 'PASS' : failures + ' FAILED'}`)
process.exit(failures === 0 ? 0 : 1)
