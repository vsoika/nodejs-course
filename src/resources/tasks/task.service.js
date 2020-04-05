const usersRepo = require('./task.memory.repository');

const getAll = () => usersRepo.getAll();

module.exports = { getAll };
