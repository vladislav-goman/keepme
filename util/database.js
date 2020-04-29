const Sequelize = require('sequelize');

const sequelize = new Sequelize('keep_me', 'root', 'root', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
