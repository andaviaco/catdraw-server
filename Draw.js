const { ACTIONS } = require('./const');
const { FIGURE_DURATION, COLOR_MAP } = require('./const');


class Draw {
  constructor(connection) {
    this.connection = connection;

    this.queue = [];
    this.isRunnig = false;
  }

  run() {
    this.isRunnig = true;

    const figure = this.queue.shift();

    for (const position of figure) {
      this.connection.write([ACTIONS.draw, ...position, 1]);
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

    if (!this.isRunnig) {
      this.run();
    }
  }

  translatePosition(row, col, color='green') {
    const fixedCol = col * Object.keys(COLOR_MAP).length + COLOR_MAP[color];

    return [row, fixedCol];
  }

  clearBoard() {
    this.connection.write([ACTIONS.reset]);
  }
}

module.exports = Draw;
