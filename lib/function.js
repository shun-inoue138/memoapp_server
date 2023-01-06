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

const decodeToken = (req) => {
  const bearerHeaders = req.headers["authorization"];
  console.log({ bearerHeaders });

  if (bearerHeaders) {
    const bearer = bearerHeaders.split(" ");
    const bearerToken = bearer[1];
    console.log({ bearerToken });
    try {
      const decodedToken = jwt.verify(bearerToken, process.env.JWT_SECRET);
      console.log({ decodedToken });
      return decodedToken;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  console.log("bearerHeadersがない");
  return null;
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
  decodeToken,
  duplicateChecker,
};
