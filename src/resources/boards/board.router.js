const router = require('express').Router();
const Board = require('./board.model');
const usersService = require('./board.service');
const All_BOARDS = require('./board.memory.repository');

router.route('/').get(async (req, res) => {
  const boards = await usersService.getAll();
  // map user fields to exclude secret fields like "password"
  res.json(boards.map(Board.toResponse));
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
    await res.json(`The board with id ${id} doesn't exist`);
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

    await res.json(`The user ${board.title} have been updated successfully`);
  } else {
    await res.json(`The user with id ${id} doesn't exist`);
  }
});

router.route('/:id').delete(async (req, res) => {
  const id = req.params.id;
  const board = All_BOARDS.boards.find(item => item.id === id);

  if (board) {
    All_BOARDS.boards.forEach((item, i) => {
      if (item.id === id) {
        All_BOARDS.boards.splice(i, 1);
      }
    });

    await res.json(`The user ${board.title} have been deleted successfully`);
  } else {
    await res.json(`The user with id ${id} doesn't exist`);
  }
});

module.exports = router;
