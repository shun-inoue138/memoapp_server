const router = require("express").Router();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

app.use(express.json());
require("dotenv").config();

const { body, validationResult, check } = require("express-validator");
const {
  duplicateChecker,
  hashPassword,
  generateToken,
} = require("../../../lib/function");
const { authValidator } = require("../handlers/validation.js");
const { register, signIn } = require("../controllers/user.js");
const { verifyToken } = require("../handlers/tokenHandler.js");

router.get("/", (req, res) => {
  res.send("auth router!");
});

//ユーザー登録
router.post(
  "/signup",
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
  authValidator,
  register
);
//ログイン
router.post(
  "/signin",
  body("email")
    .isString()
    .isEmail()
    .withMessage("メールアドレスを入力してください"),
  body("password")
    .isString()
    .isLength({ min: 4 })
    .withMessage("パスワードを4文字以上で入力してください"),
  authValidator,
  signIn
);

//jwt認証
router.post("/verify-token", verifyToken, (req, res) => {
  return res.status(200).json({ user: req.user });
});

module.exports = router;
