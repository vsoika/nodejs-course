const router = require('express').Router();
const User = require('./user.model');
const usersService = require('./user.service');
const All_USERS = require('./user.memory.repository');

router.route('/').get(async (req, res) => {
  const users = await usersService.getAll();
  // map user fields to exclude secret fields like "password"
  res.json(users.map(User.toResponse));
});

router.route('/').post(async (req, res) => {
  const newUser = new User(req.body);
  All_USERS.users.push(newUser);
  console.log(All_USERS.users);
  await res.json(User.toResponse(newUser));
});

router.route('/:id').get(async (req, res) => {
  const id = req.params.id;
  const user = All_USERS.users.find(item => item.id === id);

  if (user) {
    await res.json(User.toResponse(user));
  } else {
    await res.json(`The user with id ${id} doesn't exist`);
  }
});

router.route('/:id').put(async (req, res) => {
  const id = req.params.id;
  const user = All_USERS.users.find(item => item.id === id);
  const updatedUser = req.body;

  if (user) {
    for (const key in user) {
      if (updatedUser[key]) {
        user[key] =
          user[key] !== updatedUser[key] ? updatedUser[key] : user[key];
      }
    }

    await res.json(`The user ${user.name} have been updated successfully`);
  } else {
    await res.json(`The user with id ${id} doesn't exist`);
  }
});

router.route('/:id').delete(async (req, res) => {
  const id = req.params.id;
  const user = All_USERS.users.find(item => item.id === id);

  if (user) {
    All_USERS.users.forEach((item, i) => {
      if (item.id === id) {
        All_USERS.users.splice(i, 1);
      }
    });

    await res.json(`The user ${user.name} have been deleted successfully`);
  } else {
    await res.json(`The user with id ${id} doesn't exist`);
  }
});

module.exports = router;
