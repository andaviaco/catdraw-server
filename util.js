const { COLOR_KEYS, COLOR_MAP } = require('./const');


exports.translatePosition = function (row, col, color=COLOR_KEYS.green) {
  const fixedCol = col * Object.keys(COLOR_MAP).length + COLOR_MAP[color];

  return [row, fixedCol];
}
