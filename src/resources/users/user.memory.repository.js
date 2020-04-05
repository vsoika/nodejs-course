const users = [
  {
    id: 'bfd5b913-29ae-49c2-aa7b-87fb60ee7f55',
    name: 'Volha Soika',
    login: 'vsoika',
    password: '12345678'
  },
  {
    id: 'b8b06ff9-422a-4afc-ac46-9ce01427db3c',
    name: 'Pavel Ivanov',
    login: 'pav124',
    password: '5554879'
  }
];

const getAll = () => {
  return users;
};

module.exports = { getAll };
module.exports.users = users;
