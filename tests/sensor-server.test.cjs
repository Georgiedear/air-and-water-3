const { test } = require('node:test')
const assert = require('node:assert/strict')
const { once } = require('node:events')
const { PassThrough } = require('node:stream')
const { io } = require('socket.io-client')
const { createSensorServer } = require('../server/build/index.js')

test('Arduino readings travel through the serial parser and Socket.IO to the client', { timeout: 5000 }, async t => {
  const serial = new PassThrough()
  const app = createSensorServer({
    list: async () => [{ path: '/test-arduino', manufacturer: 'Arduino' }],
    open: path => { assert.equal(path, '/test-arduino'); return serial },
  })
  t.after(() => app.close())
  await app.connectArduino()
  app.server.listen(0, '127.0.0.1')
  await once(app.server, 'listening')
  const socket = io(`http://127.0.0.1:${app.server.address().port}`, { transports: ['polling', 'websocket'] })
  t.after(() => socket.disconnect())
  await once(socket, 'connect')
  const received = once(socket, 'data')
  serial.write('1.25:2.')
  serial.write('5:3.75\n')
  const [values] = await received
  assert.deepEqual(values, [1.25, 2.5, 3.75])
})

test('No Arduino leaves the server available for the keyboard demo', { timeout: 5000 }, async t => {
  const app = createSensorServer({ list: async () => [], open: () => { throw new Error('No port should open') } })
  t.after(() => app.close())
  await app.connectArduino()
  app.server.listen(0, '127.0.0.1')
  await once(app.server, 'listening')
  const socket = io(`http://127.0.0.1:${app.server.address().port}`)
  t.after(() => socket.disconnect())
  await once(socket, 'connect')
  assert.equal(socket.connected, true)
})
