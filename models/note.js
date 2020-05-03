const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Note = sequelize.define("note", {
  title: Sequelize.STRING(100),
  text: Sequelize.STRING(2000),
  isArchived: {
    type: Sequelize.BOOLEAN(),
    defaultValue: false,
    allowNull: false,
  },
  isPinned: {
    type: Sequelize.BOOLEAN(),
    defaultValue: false,
    allowNull: false,
  },
});

module.exports = Note;
