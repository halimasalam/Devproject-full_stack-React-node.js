const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ROLES = require("../configs/roles");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(403);
    const user = await User.findById(decoded.userId).select("-password").lean();
    if (user.role === ROLES.user) {
      req.caloriesLimitPerDay = user.caloriesLimitPerDay;
    }
    req.userId = user._id;
    req.isAdmin = user.role === ROLES.admin;
    next();
  });
};

module.exports = verifyToken;
