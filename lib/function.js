const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};
const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
const duplicateChecker = async (value, type) => {
  let valueType;
  if (type === "email") {
    valueType = "email";
  } else if (type === "username") {
    valueType = "username";
  }

  const user = await User.findOne({ [valueType]: value }).exec();
  console.log(user);

  if (user) {
    throw new Error(`${valueType}は既に登録されています`);
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  duplicateChecker,
};
