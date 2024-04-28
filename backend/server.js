const express = require("express");
const dbConnection = require("./database/db");
const { PORT } = require("./config/index");
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.use(express.json());
app.use(router);

dbConnection();

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is listening on port: ${PORT}`);
});
