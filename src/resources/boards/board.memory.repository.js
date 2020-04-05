const Board = require('./board.model');
const Column = require('./column.model');

const boards = [
  new Board({
    title: 'boards1',
    columns: [
      new Column({ title: 'columns1', order: 0 }),
      new Column({ title: 'columns2', order: 1 })
    ]
  }),
  new Board({
    title: 'boards2',
    columns: [
      new Column({ title: 'columns1', order: 3 }),
      new Column({ title: 'columns2', order: 2 })
    ]
  })
];

const getAll = () => {
  return boards;
};

module.exports = { getAll };
module.exports.boards = boards;
