const User = require("../models/User");
const Meal = require("../models/Meal");
const FoodEntry = require("../models/FoodEntry");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const ROLES = require("../configs/roles");

const getAllUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password").lean();

  if (!users?.length) {
    return res.status(404).json({ message: "No users found" });
  }

  res.json(
    users.map(user => ({ ...user, isAdmin: user.role === ROLES.admin }))
  );
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").lean();

  if (!user) {
    return res.status(404).json({ message: "No user found" });
  }

  res.json({ ...user, isAdmin: user.role === ROLES.admin });
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userRole = role || ROLES.user;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  if (Object.values(ROLES).indexOf(userRole) === -1) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role: userRole
  });

  const token = generateToken(user._id);
  await User.findByIdAndUpdate(user._id, { token });

  if (user) {
    if (req?.isInvite) return;
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, caloriesLimitPerDay } = req.body;

  if (caloriesLimitPerDay && caloriesLimitPerDay <= 0) {
    return res.status(400).json({ message: "Invalid calories limit" });
  }

  const user = await User.findById(req.params.id);

  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password ? await bcrypt.hash(password, 10) : user.password;
    user.role = Object.values(ROLES).indexOf(role) === -1 ? user.role : role;
    user.caloriesLimitPerDay = caloriesLimitPerDay || user.caloriesLimitPerDay;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      caloriesLimitPerDay: updatedUser.caloriesLimitPerDay
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  await Meal.deleteMany({ user: req.params.id });
  await FoodEntry.deleteMany({ user: req.params.id });

  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
