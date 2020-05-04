const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Language = sequelize.define("language", {
  name: Sequelize.STRING(100),
  shortName: Sequelize.STRING(100),
  imageUrl: Sequelize.STRING(500),
});

module.exports = Language;
