const User = require('./user.model');

const users = [
  new User({ name: 'Volha Soika', login: 'vsoika', password: '12345678' }),
  new User({ name: 'Pavel Ivanov', login: 'pav124', password: '5554879' })
];

const getAll = () => {
  return users;
};

module.exports = { getAll };
module.exports.users = users;
