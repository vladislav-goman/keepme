const Sequelize = require("sequelize");

const config = process.env.DATABASE_URL
  ? process.env.DATABASE_URL
  : (process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
      dialect: process.env.DIALECT,
      host: process.env.HOST,
    });

const sequelize = new Sequelize(config);

module.exports = sequelize;
