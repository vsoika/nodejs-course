const router = require('express').Router({ mergeParams: true });
const Task = require('./task.model');
const ALL_TASKS = require('./task.memory.repository');
const All_BOARDS = require('../boards/board.memory.repository');

router.route('/').get(async (req, res) => {
  const id = req.params.boardId;
  const task = ALL_TASKS.tasks.filter(item => item.boardId === id);

  if (task.length) {
    await res.json(task.map(Task.toResponse));
  } else {
    res
      .status(404)
      .send({ error: `The board with id ${id} doesn't have any tasks` });
  }
});

router.route('/').post(async (req, res) => {
  const id = req.params.boardId;
  let newTask = req.body;
  newTask['boardId'] = id;
  newTask = new Task(newTask);
  ALL_TASKS.tasks.push(newTask);

  await res.json(Task.toResponse(newTask));
});

router.route('/:taskId').get(async (req, res) => {
  const boardId = req.params.boardId;
  const taskId = req.params.taskId;

  const board = All_BOARDS.boards.find(item => item.id === boardId);

  if (board) {
    const task = ALL_TASKS.tasks.find(item => item.id === taskId);
    if (task) {
      await res.json(Task.toResponse(task));
    } else {
      res
        .status(404)
        .send({ error: `The task with id ${taskId} doesn't exist` });
    }
  } else {
    res
      .status(404)
      .send({ error: `The board with id ${boardId} doesn't exist` });
  }
});

router.route('/:taskId').put(async (req, res) => {
  const boardId = req.params.boardId;
  const taskId = req.params.taskId;

  const board = All_BOARDS.boards.find(item => item.id === boardId);
  const updatedTask = req.body;

  if (board) {
    const task = ALL_TASKS.tasks.find(item => item.id === taskId);
    if (task) {
      for (const key in board) {
        if (updatedTask[key]) {
          task[key] =
            task[key] !== updatedTask[key] ? updatedTask[key] : task[key];
        }
      }
      await res.json(
        `The task with id ${taskId} have been updated successfully`
      );
    } else {
      res
        .status(404)
        .send({ error: `The task with id ${taskId} doesn't exist` });
    }
  } else {
    res
      .status(404)
      .send({ error: `The board with id ${boardId} doesn't exist` });
  }
});

router.route('/:taskId').delete(async (req, res) => {
  const boardId = req.params.boardId;
  const taskId = req.params.taskId;
  const board = All_BOARDS.boards.find(item => item.id === boardId);

  if (board) {
    const task = ALL_TASKS.tasks.find(item => item.id === taskId);
    if (task) {
      ALL_TASKS.tasks.forEach((item, i) => {
        if (item.id === taskId) {
          ALL_TASKS.tasks.splice(i, 1);
        }
      });
    } else {
      res
        .status(404)
        .send({ error: `The task with id ${taskId} doesn't exist` });
    }
    await res.json(`The task with id ${taskId} have been deleted successfully`);
  } else {
    res
      .status(404)
      .send({ error: `The board with id ${boardId} doesn't exist` });
  }
});

module.exports = router;
