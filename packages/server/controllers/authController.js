const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const ROLES = require("../configs/roles");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(404).json({ message: "User does not exist" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.status(200).json({
    name: user.name,
    email: user.email,
    isAdmin: user.role === ROLES.admin,
    token: user.token,
    caloriesLimitPerDay:
      user.role === ROLES.user ? user.caloriesLimitPerDay : null
  });
});

const generateUserToken = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Please provide email" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User does not exist" });
  }

  const token = generateToken(user._id);
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    name: user.name,
    email: user.email,
    isAdmin: user.role === ROLES.admin,
    token
  });
});

module.exports = { login, generateUserToken };
