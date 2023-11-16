const Meal = require("../models/Meal");
const FoodEntry = require("../models/FoodEntry");
const asyncHandler = require("express-async-handler");

const getMealByUserId = asyncHandler(async (req, res) => {
  const meals = await Meal.find({ user: req.userId }).select("-user").lean();

  if (!meals || meals.length === 0) {
    return res.status(404).json({ message: "No meal found" });
  }

  res.json(meals);
});

const getAllMeals = asyncHandler(async (req, res) => {
  if (!req.isAdmin) return getMealByUserId(req, res);

  const meals = await Meal.find().populate("user", "name email").lean().exec();

  if (!meals?.length) {
    return res.status(404).json({ message: "No meals found" });
  }

  res.json(meals);
});

const createMeal = asyncHandler(async (req, res) => {
  const { name, maxFoodEntries, userId } = req.body;

  if (!name || !maxFoodEntries) {
    return res
      .status(400)
      .json({ message: "Please provide name and maxFoodEntries" });
  }

  if (req.isAdmin && !userId) {
    return res
      .status(400)
      .json({ message: "Please provide userId when creating meal" });
  }

  const mealExists = await Meal.find({
    user: req.isAdmin ? userId : req.userId
  })
    .findOne({ name })
    .lean();

  if (mealExists) {
    return res.status(400).json({ message: "Meal already exists" });
  }

  const meal = await Meal.create({
    name,
    maxFoodEntries,
    user: req.isAdmin ? userId : req.userId
  });

  if (meal) {
    res.status(201).json({
      _id: meal._id,
      name: meal.name,
      maxFoodEntries: meal.maxFoodEntries
    });
  } else {
    res.status(400).json({ message: "Invalid meal data" });
  }
});

const updateMeal = asyncHandler(async (req, res) => {
  const { name, maxFoodEntries, userId } = req.body;

  if (req.isAdmin && !userId) {
    return res
      .status(400)
      .json({ message: "Please provide userId when updating meal" });
  }

  const meal = await Meal.findById(req.params.id);

  if (!meal) {
    return res.status(404).json({ message: "Meal not found" });
  }

  if (
    meal.user.toString() !==
    (req.isAdmin ? userId.toString() : req.userId.toString())
  ) {
    return res.sendStatus(403);
  }

  meal.name = name || meal.name;
  meal.maxFoodEntries = maxFoodEntries || meal.maxFoodEntries;

  const updatedMeal = await meal.save();

  res.json({
    _id: updatedMeal._id,
    name: updatedMeal.name,
    maxFoodEntries: updatedMeal.maxFoodEntries
  });
});

const deleteMeal = asyncHandler(async (req, res) => {
  const meal = await Meal.findById(req.params.id);

  if (!meal) {
    return res.status(404).json({ message: "Meal not found" });
  }

  if (!req.isAdmin && meal.user.toString() !== req.userId.toString()) {
    return res.sendStatus(403);
  }

  const mealIsActive = await FoodEntry.findOne({
    meal: req.params.id
  }).lean();

  if (mealIsActive) {
    return res
      .status(400)
      .json({ message: "Meal cannot be deleted because it is still active" });
  }

  await meal.remove();
  res.json({ message: "Meal removed" });
});

module.exports = {
  getAllMeals,
  createMeal,
  updateMeal,
  deleteMeal
};
