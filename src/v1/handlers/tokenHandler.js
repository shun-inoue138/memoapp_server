const { decodeToken } = require("../../../lib/function");
const User = require("../models/user");

const verifyToken = async (req, res, next) => {
  console.log("verifyTokenに入った");
  const decodedToken = decodeToken(req);
  if (!decodedToken) {
    return res.status(401).send({ error: "トークンが無効です" });
  }
  try {
    const user = await User.findById(decodedToken.id);
    console.log(user);
    if (!user) {
      return res.status(401).json({ error: "権限がありません" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = { verifyToken };
