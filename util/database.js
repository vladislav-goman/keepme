const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: process.env.DIALECT,
    host: process.env.HOST,
    production: {
      use_env_variable: process.env.DATABASE_URL,
      dialect: "postgres",
    },
  }
);

module.exports = sequelize;
