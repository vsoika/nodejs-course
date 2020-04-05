const uuid = require('uuid');
const Column = require('./column.model');

class Board {
  constructor({
    id = uuid(),
    title = 'BoardName',
    columns = [
      new Column({ title: 'columns1', order: 0 }),
      new Column({ title: 'columns2', order: 1 })
    ]
  } = {}) {
    this.id = id;
    this.title = title;
    this.columns = columns;
  }

  static toResponse(board) {
    const { id, title, columns } = board;
    return { id, title, columns };
  }
}

module.exports = Board;
