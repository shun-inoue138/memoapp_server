const { validationResult } = require("express-validator");

const authValidator = (req, res, next) => {
  console.log("authValidator");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { authValidator };
