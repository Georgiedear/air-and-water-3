"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const serialport_1 = __importDefault(require("serialport"));
const app = express_1.default();
const server = http_1.default.createServer(app);
const io = socket_io_1.default(server);
const port = 8888;
server.listen(port, '0.0.0.0', () => console.log(`🌎 - Started server on port ${port}.`));
io.on('connection', socket => {
    console.log('Socket connected.');
});
const Readline = serialport_1.default.parsers.Readline;
const usbport = new serialport_1.default('/dev/tty.usbmodem14201');
usbport.on('error', () => console.log('Could not connect to Arduino.'));
const parser = usbport.pipe(new Readline());
parser.on('data', (data) => {
    console.log('data', data);
    const values = data.split(':').map(parseFloat);
    io.emit('data', values);
});
