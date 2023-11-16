const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  const payload = { userId };
  return jwt.sign(payload, process.env.TOKEN_SECRET);
};

module.exports = generateToken;
