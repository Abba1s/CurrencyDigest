const express = require("express");
const { login, register } = require("../controllers/authController");

const router = express.Router();

//test

router.get("/test", (req, res) => {
  res.json({ msg: "Hello" });
});

//user

//register
router.post("/register", register);
//login
router.post("/login", login);

//blogs

//comment

module.exports = router;
