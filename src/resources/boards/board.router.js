const router = require('express').Router();
const Board = require('./board.model');
const usersService = require('./board.service');
const All_BOARDS = require('./board.memory.repository');
const ALL_TASKS = require('../tasks/task.memory.repository');

router.route('/').get(async (req, res) => {
  const boards = await usersService.getAll();
  // map user fields to exclude secret fields like "password"
  if (boards.length) {
    await res.json(boards.map(Board.toResponse));
  } else {
    res.status(404).send({ error: 'The boards not found' });
  }
});

router.route('/').post(async (req, res) => {
  const newBoard = new Board(req.body);
  All_BOARDS.boards.push(newBoard);
  await res.json(Board.toResponse(newBoard));
});

router.route('/:id').get(async (req, res) => {
  const id = req.params.id;
  const board = All_BOARDS.boards.find(item => item.id === id);

  if (board) {
    await res.json(Board.toResponse(board));
  } else {
    res.status(404).send({ error: `The board with id ${id} doesn't exist` });
  }
});

router.route('/:id').put(async (req, res) => {
  const id = req.params.id;
  const board = All_BOARDS.boards.find(item => item.id === id);
  const updatedBoard = req.body;

  if (board) {
    for (const key in board) {
      if (updatedBoard[key]) {
        board[key] =
          board[key] !== updatedBoard[key] ? updatedBoard[key] : board[key];
      }
    }

    await res.json(`The board with id ${id} have been updated successfully`);
  } else {
    res.status(404).send({ error: `The board with id ${id} doesn't exist` });
  }
});

router.route('/:id').delete(async (req, res) => {
  const id = req.params.id;
  const board = All_BOARDS.boards.find(item => item.id === id);

  if (Object.keys(board).length) {
    All_BOARDS.boards.forEach((item, i) => {
      if (item.id === id) {
        All_BOARDS.boards.splice(i, 1);
      }
    });

    ALL_TASKS.tasks.forEach((item, i) => {
      if (item.boardId === id) {
        ALL_TASKS.tasks.splice(i, 1);
      }
    });

    console.log(ALL_TASKS.tasks);

    await res.json(`The board with id ${id} have been deleted successfully`);
  } else {
    await res
      .status(404)
      .send({ error: `The board with id ${id} doesn't exist` });
  }
});

module.exports = router;
