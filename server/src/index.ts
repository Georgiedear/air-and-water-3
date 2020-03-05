import express from 'express'
import socket from 'socket.io'
import http from 'http'
import SerialPort from 'serialport'

const app = express()
const server = http.createServer(app)
const io = socket(server)
const port = 8888

async function run() {
  server.listen(port, '0.0.0.0', () =>
    console.log(`🌎 - Started server on port ${port}.`),
  )

  io.on('connection', socket => {
    console.log('Socket connected.')
  })

  const Readline: any = SerialPort.parsers.Readline

  const ports = await SerialPort.list()

  const arduinoPortInfo = ports.find(
    p => p.manufacturer && p.manufacturer.includes('Arduino'),
  )

  if (arduinoPortInfo === undefined) {
    console.error('Could not connect to Arduino.')
  } else {
    const usbport = new SerialPort(arduinoPortInfo.path)
    usbport.on('error', error =>
      console.error('Arduino connection error:', error),
    )
    const parser = usbport.pipe(new Readline())
    parser.on('data', (data: string) => {
      console.log('data', data)
      const values = data.split(':').map(parseFloat)
      io.emit('data', values)
    })
  }
}

run()
