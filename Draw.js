const events = require('events');

const { ACTIONS } = require('./const');
const { FIGURE_DURATION, COLOR_MAP, COLOR_KEY } = require('./const');


class Draw {
  constructor(connection) {
    this.connection = connection;

    this.queue = [];
    this.isRunnig = false;

    this.eventEmitter = new events.EventEmitter();
  }

  get ogQueue() {
    return this.queue.map(figure => (
      figure.map(position => this.revertePositionTranslation(...position))
    ));
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

  revertePositionTranslation(row, col) {
    const len = Object.keys(COLOR_MAP).length;
    const color_val = (col % len);
    const originalCol = (col - color_val) / len;

    return [row, originalCol, COLOR_KEY[color_val]];
  }

  clearBoard() {
    this.connection.write([ACTIONS.reset, 0, 0, 0]);
  }

  on(event, handler) {
    this.eventEmitter.on(event, handler);
  }
}

module.exports = Draw;
