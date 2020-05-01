const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");

const mailAuth = {
  auth: {
    api_key: process.env.MAIL_SERVER_API_KEY,
    domain: process.env.MAIL_SERVER_DOMAIN,
  },
};

const emailer = nodemailer.createTransport(mg(mailAuth));

module.exports = emailer;
