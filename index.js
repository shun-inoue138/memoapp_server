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
app.post(
  "/api/users",
  body("username")
    .isString()
    .isLength({ min: 2 })
    .withMessage("ユーザー名を２文字以上で入力してください"),
  body("email")
    .isString()
    .isEmail()
    .withMessage("メールアドレスを入力してください"),
  body("password")
    .isString()
    .isLength({ min: 4 })
    .withMessage("パスワードを4文字以上で入力してください"),
  check("email").custom(async (value) => {
    await duplicateChecker(value, "email");
  }),
  check("username").custom(async (value) => {
    await duplicateChecker(value, "username");
  }),

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const hashedPassword = hashPassword(req.body.password);
      console.log(hashedPassword);
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
      const newUser = await User.create(user);
      console.log({ newUser });
      const token = generateToken(newUser);
      console.log({ token });
      return res.status(201).json({ token, user: newUser });

      // console.log("1");
      // await User.findOne({ username: user.username }, (err, user) => {
      //   if (user) {
      //     existsUser = true;
      //   }
      //   console.log(user);
      // });
      // console.log("4");
      // await User.findOne({ email: user.email }, (err, user) => {
      //   if (user) {
      //     existsEmail = true;
      //   }
      //   console.log("3");
      // });
      // if (existsUser && existsEmail) {
      //   res.status(400).send("ユーザー名とメールアドレスは既に登録されています");
      // } else if (existsUser) {
      //   res.status(400).send("ユーザー名は既に登録されています");
      // } else if (existsEmail) {
      //   res.status(400).send("メールアドレスは既に登録されています");
      // }
      // res.status(201).send({ user: user });
      // await user.save();
      // res.status(201).send(user);
    } catch (error) {
      res.status(400).send(`ユーザー登録に失敗しました(catch): ${error}`);
    }
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
