const uuid = require('uuid');

class Column {
  constructor({ id = uuid(), title = 'ColumnName', order = 0 } = {}) {
    this.id = id;
    this.title = title;
    this.order = order;
  }

  //   static toResponse(board) {
  //     const { id, title, columns } = board;
  //     return { id, title, columns };
  //   }
}

module.exports = Column;
