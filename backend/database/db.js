const mongoose = require("mongoose");
const { MONGO_URL } = require("../config/index");

const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URL);
    console.log(`Database connected at host ${conn.connection.host}`);
  } catch (error) {
    console.log(`DB Connection Failed : ${error}`);
  }
};

module.exports = dbConnection;
