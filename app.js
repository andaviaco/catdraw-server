const express = require('express');
const SerialPort = require("serialport");
const bodyParser = require("body-parser");
const cors = require('cors');
const socketIo = require("socket.io");
const http = require('http');
const debug = require('debug')('catdraw-server');
const debugSerialPort = require('debug')('catdraw-server:serialPort');
const debugIo = require('debug')('catdraw-server:IO');

const Connection = require('./Connection');
const Draw = require('./Draw');

const app = express();
const ioServer = http.Server()
const io = socketIo(ioServer);

app.use(bodyParser.json());
app.use(cors());


// Serial Comunication
const serialport = new SerialPort("/dev/ttyACM0", {
  baudRate: 9600,
  autoOpen: false,
});

const connection = new Connection(serialport, {
  onOpen: () => debugSerialPort('Serial Port Opend'),
  onError: () => debugSerialPort('Error: ', err.message),
});

const draw = new Draw(connection);


// API
app.get('/', () => {
  res.send('Hello World!')
})

app.get('/:x/:y', (req, res) => {
  if (connection.isOpen) {
    connection.write([0, req.params.x, req.params.y, 1]);

    return res.send(`LED: ${req.params.x}, ${req.params.y}`);
  }

  return res.send(`Serial Port connection is not open.`);
})

app.post('/figure', (req, res) => {
  const figure = req.body;

  draw.addFigure(figure);

  return res.status(201).send('Figure added!')
})


// Socket IO
io.on('connection', (socket) => {
  debugIo('User connected');

  draw.on('enqueueFigure', figure => socket.emit('queueChange', draw.ogQueue));
  draw.on('popFigure', figure => (socket.emit('queueChange', draw.ogQueue));
});


app.listen(3000, () => {
  debug('listening on port 3000!')
})

ioServer.listen(3030, () => {
  debugIo('listening on port 3030!')
});
