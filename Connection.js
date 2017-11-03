class Connection {
  constructor(serialPort, config={}) {
    this.serialPort = serialPort;

    this.serialPort.open();
    this.serialPort.on('open', config.onOpen);
    this.serialPort.on('error', config.onError);
  }

  write(data) {
    new Promise((resolve, reject) => {
      this.serialPort.write(data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  isOpen() {
    return this.serialPort.isOpen();
  }
}

module.exports = Connection;
