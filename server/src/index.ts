import express from 'express'
import { Server } from 'socket.io'
import http from 'http'
import { Duplex } from 'stream'
import { SerialPort, ReadlineParser } from 'serialport'

interface SensorPorts {
  list: () => Promise<Array<{ path: string; manufacturer?: string }>>
  open: (path: string) => Duplex
}

export function createSensorServer(ports: SensorPorts = {
  list: () => SerialPort.list(),
  open: path => new SerialPort({ path, baudRate: 9600 }),
}) {
  const server = http.createServer(express())
  const io = new Server(server, {
    cors: {
      origin: (process.env.CLIENT_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000').split(','),
    },
  })
  let serial: Duplex | undefined

  async function connectArduino() {
    const available = await ports.list()
    const arduino = available.find(p => p.manufacturer?.includes('Arduino'))
    if (!arduino) {
      console.error('Could not connect to Arduino.')
      return
    }
    serial = ports.open(arduino.path)
    serial.on('error', error => console.error('Arduino connection error:', error))
    const parser = serial.pipe(new ReadlineParser())
    parser.on('data', (data: string) => {
      const values = data.split(':').map(Number.parseFloat)
      io.emit('data', values)
    })
  }

  function close(): Promise<void> {
    serial?.destroy()
    return new Promise(resolve => io.close(() => resolve()))
  }

  return { server, io, connectArduino, close }
}

if (require.main === module) {
  const app = createSensorServer()
  app.server.listen(8888, '0.0.0.0', () => console.log('Started server on port 8888.'))
  app.connectArduino().catch(error => console.error('Arduino discovery failed:', error))
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => void app.close())
}
