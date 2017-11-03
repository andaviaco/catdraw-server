const events = require('events');

const { ACTIONS } = require('./const');
const { FIGURE_DURATION, COLOR_MAP } = require('./const');


class Draw {
  constructor(connection) {
    this.connection = connection;

    this.queue = [];
    this.isRunnig = false;

    this.eventEmitter = new events.EventEmitter();
  }

  async run() {
    this.isRunnig = true;

    const figure = this.queue.shift();


    for (const position of figure) {
      await this.connection.write([ACTIONS.draw, ...position, 1]);
    }

    setTimeout(() => {
      this.clearBoard();

      if (this.queue.length) {
        this.run();
      } else {
        this.isRunnig = false;
      }
    }, FIGURE_DURATION);
  }

  addFigure(figure) {
    const realFigure = figure.map(position => this.translatePosition(...position))

    this.queue.push(realFigure);

    this.eventEmitter.emit('newFigure', figure);

    if (!this.isRunnig) {
      this.run();
    }
  }

  translatePosition(row, col, color='green') {
    const fixedCol = col * Object.keys(COLOR_MAP).length + COLOR_MAP[color];

    return [row, fixedCol];
  }

  clearBoard() {
    this.connection.write([ACTIONS.reset, 0, 0, 0]);
  }

  on(event, handler) {
    this.eventEmitter.on(event, handler);
  }
}

module.exports = Draw;
