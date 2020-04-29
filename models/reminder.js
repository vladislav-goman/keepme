const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Reminder = sequelize.define("reminder", {
  timestamp: Sequelize.DATE(),
  remindText: Sequelize.STRING(1000),
});

module.exports = Reminder;
