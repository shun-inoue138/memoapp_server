const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../src/v1/models/user.js");

const hashPassword = (password) => {
  console.log("hashPassword is called");
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};
const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

const generateToken = (user) => {
  console.log("generateToken is called");
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const duplicateChecker = async (value, type) => {
  console.log(value);
  const user = await User.findOne({ [type]: value });
  if (user) {
    throw new Error(`${type}は既に登録されています`);
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  duplicateChecker,
};
