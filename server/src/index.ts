import express from 'express'
import socket from 'socket.io'
import http from 'http'
import SerialPort from 'serialport'

const app = express()
const server = http.createServer(app)
const io = socket(server)

const port = 8888

server.listen(port, '0.0.0.0', () =>
  console.log(`🌎 - Started server on port ${port}.`),
)

io.on('connection', socket => {
  console.log('Socket connected.')
})

const Readline: any = SerialPort.parsers.Readline

const usbport = new SerialPort('/dev/tty.usbmodem14201')

usbport.on('error', () => console.log('Could not connect to Arduino.'))

const parser = usbport.pipe(new Readline())

parser.on('data', (data: string) => {
  console.log('data', data)
  const values = data.split(':').map(parseFloat)
  io.emit('data', values)
})
