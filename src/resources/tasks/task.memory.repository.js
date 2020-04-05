const Task = require('./task.model');
const All_USERS = require('../users/user.memory.repository');
const ALL_BOARDS = require('../boards/board.memory.repository');

const tasks = [
  new Task({
    title: 'task1',
    order: 0,
    description: 'fix bugs',
    userId: All_USERS.users[0].id,
    boardId: ALL_BOARDS.boards[0].id,
    columnId: ALL_BOARDS.boards[0].columns[0].id
  }),
  new Task({
    title: 'task2',
    order: 0,
    description: 'create component',
    userId: All_USERS.users[1].id,
    boardId: ALL_BOARDS.boards[1].id,
    columnId: ALL_BOARDS.boards[1].columns[1].id
  })
];

const getAll = () => {
  return tasks;
};

module.exports = { getAll };
module.exports.tasks = tasks;
