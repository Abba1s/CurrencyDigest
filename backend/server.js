const express = require("express");
const dbConnection = require("./database/db");
const { PORT } = require("./config/index");
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  credentials: true,
  origin: ["http://localhost:3000"], // Whitelist the domains you want to allow
};

app.use(cors(corsOptions));
app.use(router);

dbConnection();

app.use(errorHandler);

app.use("/storage", express.static("storage"));

app.listen(PORT, () => {
  console.log(`App is listening on port: ${PORT}`);
});
