const express = require("express");
const app = express();
const port = 3003;
const mongoose = require("mongoose");
const {
  hashPassword,
  generateToken,
  duplicateChecker,
} = require("./lib/function.js");
const jwt = require("jsonwebtoken");
app.use(express.json());
require("dotenv").config();
const User = require("./src/v1/models/user.js");
const { body, validationResult, check } = require("express-validator");
app.use("/api/v1", require("./src/v1/routes/auth.js"));

//DB接続
try {
  mongoose.connect(process.env.MONGODB_URL, () =>
    console.log("MongoDB Connected")
  );
} catch (error) {
  console.log(error);
}

app.get("/api", (req, res) => {
  res.send("Hello World!");
});
//ユーザー一覧
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});
//ユーザー登録

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
