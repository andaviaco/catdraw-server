const express = require('express');
const SerialPort = require("serialport");
const bodyParser = require("body-parser");
const cors = require('cors');
const debug = require('debug')('catdraw-server');
const debugSerialPort = require('debug')('catdraw-server:serialPort');

const Connection = require('./Connection');
const Draw = require('./Draw');

const app = express()

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


app.listen(3000, () => {
  debug('listening on port 3000!')
})
