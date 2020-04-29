const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Tag = sequelize.define("tag", {
  name: Sequelize.STRING(50),
  description: Sequelize.STRING(500),
});

module.exports = Tag;
