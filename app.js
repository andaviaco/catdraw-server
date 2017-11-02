const express = require('express');
const SerialPort = require("serialport");
const bodyParser = require("body-parser");
const debug = require('debug')('catdraw-server');
const debugSerialPort = require('debug')('catdraw-server:serialPort');

const { translatePosition } = require('./util');

const app = express()
const serialport = new SerialPort("/dev/ttyACM0", {
  baudRate: 9600,
});

app.use(bodyParser.json());


// Serial Comunication
serialport.on('open', () => {
  debugSerialPort('Serial Port Opend');
});

serialport.on('error', (err) => {
  console.error('Error: ', err.message);
});

serialport.on('readable', () => {
  debugSerialPort('Data:', serialport.read());
});


// API
app.get('/', () => {
  res.send('Hello World!')
})

app.get('/:x/:y', (req, res) => {
  if (serialport.isOpen) {
    serialport.write([0, req.params.x, req.params.y, 1], () => debugSerialPort('Mensaje enviado'))

    return res.send(`LED: ${req.params.x}, ${req.params.y}`)
  }

  return res.send(`Serial Port connection is not open.`)
})

app.post('/figure', (req, res) => {
  const figure = req.body;

  const realPositions = figure.map(position => translatePosition(...position))

  console.log(realPositions);
})


app.listen(3000, () => {
  debug('listening on port 3000!')
})
