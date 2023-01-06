const { hashPassword, generateToken } = require("../../../lib/function.js");
const User = require("../models/user.js");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    const user = new User({
      username,
      email,
      password: hashPassword(password),
    });
    console.log(user);
    await user.save();
    console.log("user.save()が終わった");
    const token = generateToken(user);
    return res.status(201).send({ user, token });
  } catch (error) {
    console.log("registerでエラー");

    return res.status(500).send(error);
  }
};

module.exports = { register };
