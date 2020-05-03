const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
  email: Sequelize.STRING,
  login: Sequelize.STRING,
  password: Sequelize.STRING(100),
  recoveryHash: Sequelize.STRING(100),
  isAdmin: {
    type: Sequelize.BOOLEAN(),
    defaultValue: false,
    allowNull: false,
  },
});

module.exports = User;
