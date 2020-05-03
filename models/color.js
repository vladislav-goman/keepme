const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Color = sequelize.define("color", {
  name: Sequelize.STRING(100),
  hash: Sequelize.STRING(10),
});

module.exports = Color;
