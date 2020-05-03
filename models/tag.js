const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Tag = sequelize.define("tag", {
  name: Sequelize.STRING(100),
  description: Sequelize.STRING(1000),
});

module.exports = Tag;
