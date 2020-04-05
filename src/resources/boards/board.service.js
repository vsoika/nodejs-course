const usersRepo = require('./board.memory.repository');

const getAll = () => usersRepo.getAll();

module.exports = { getAll };
