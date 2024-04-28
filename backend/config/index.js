const dotenv = require("dotenv").config();

const MONGO_URL = process.env.MONGODB_URL;

const PORT = process.env.PORT;

module.exports = {
  PORT,
  MONGO_URL,
};
