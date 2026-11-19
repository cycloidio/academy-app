import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { after, before, test } from 'node:test'
import { handler, readConfig, renderPage } from '../src/app.js'

let server
let base

before(async () => {
  server = createServer(handler({ service: 'orders', message: 'Hi <there>', commit: 'abc1234', environment: 'dev' }))
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  base = `http://127.0.0.1:${server.address().port}`
})

after(() => server.close())

test('the page shows the message, the commit and the environment', async () => {
  const res = await fetch(`${base}/`)
  assert.equal(res.status, 200)
  const body = await res.text()
  assert.match(body, /<code id="commit">abc1234<\/code>/)
  assert.match(body, /<code id="environment">dev<\/code>/)
  assert.match(body, /<code id="service">orders<\/code>/)
  assert.match(body, /<title>orders<\/title>/)
  assert.match(body, /Hi &lt;there&gt;/)
})

test('the health check answers ok', async () => {
  const res = await fetch(`${base}/healthz`)
  assert.equal(res.status, 200)
  assert.equal(await res.text(), 'ok\n')
})

test('an unknown path is not found', async () => {
  assert.equal((await fetch(`${base}/nope`)).status, 404)
})

test('only GET and HEAD are allowed', async () => {
  assert.equal((await fetch(`${base}/`, { method: 'POST' })).status, 405)
})

test('defaults apply when nothing is set', () => {
  assert.deepEqual(readConfig({}), {
    service: 'academy-app',
    message: 'Hello from Cycloid Academy',
    commit: 'unknown',
    environment: 'unknown',
  })
  assert.match(renderPage(readConfig({})), /unknown/)
})
