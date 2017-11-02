class Connection {
  constructor(serialPort, config={}) {
    this.serialPort = serialPort;

    this.serialPort.open();
    this.serialPort.on('open', config.onOpen);
    this.serialPort.on('error', config.onError);
  }

  write(data, cb) {
    this.serialPort.write(data, (err) => {
      console.log('Enviado');

      cb && cb(err);
    });
  }

  isOpen() {
    return this.serialPort.isOpen();
  }
}

module.exports = Connection;
