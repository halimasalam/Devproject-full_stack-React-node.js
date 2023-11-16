const FoodEntry = require("../models/FoodEntry");
const Meal = require("../models/Meal");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const checkDateFormat = require("../utils/checkDateFormat");

const getFoodEntriesByUserId = asyncHandler(async (req, res) => {
  const foodEntries = await FoodEntry.find({ user: req.userId })
    .select("-user")
    .populate("meal", "name")
    .lean()
    .exec();

  if (!foodEntries || foodEntries.length === 0) {
    return res.status(404).json({ message: "No food entry found" });
  }

  res.json(foodEntries);
});

const getAllFoodEntries = asyncHandler(async (req, res) => {
  if (!req.isAdmin) return getFoodEntriesByUserId(req, res);

  const foodEntries = await FoodEntry.find()
    .populate("meal", "name")
    .populate("user", "name email")
    .lean()
    .exec();

  if (!foodEntries?.length) {
    return res.status(404).json({ message: "No food entries found" });
  }

  res.json(foodEntries);
});

const createFoodEntry = asyncHandler(async (req, res) => {
  const { foodName, calorie, date, mealId, userId } = req.body;

  if (!foodName || !calorie || !mealId) {
    return res
      .status(400)
      .json({ message: "Please enter foodName, calorie and mealId" });
  }

  if (req.isAdmin && !userId) {
    return res
      .status(400)
      .json({ message: "Please enter userId when creating food entry" });
  }

  const newDate = date ? date : new Date().toISOString().slice(0, 10);
  const isValidDate = checkDateFormat(newDate);

  if (!isValidDate) {
    return res.status(400).json({
      message: "Please enter a valid date in the format of 'yyyy-MM-dd'"
    });
  }

  const meal = await Meal.findById(mealId)
    .where("user")
    .equals(req.isAdmin ? userId : req.userId)
    .lean()
    .exec();

  if (!meal) {
    return res.status(400).json({ message: "Invalid MealId" });
  }

  const foodEntryExists = await FoodEntry.findOne({ foodName, meal: mealId })
    .where("date")
    .equals(new Date(newDate).toISOString())
    .lean()
    .exec();

  if (foodEntryExists) {
    return res.status(400).json({ message: "Food entry already exists" });
  }

  const foodEntryInADay = await FoodEntry.find({
    user: req.isAdmin ? userId : req.userId,
    date: new Date(newDate).toISOString()
  });

  const foodEntryMealCountInADay = foodEntryInADay.filter(
    foodEntry => foodEntry.meal.toString() === mealId
  ).length;

  if (foodEntryMealCountInADay >= meal.maxFoodEntries) {
    return res.status(400).json({
      message: `You can only enter ${meal.maxFoodEntries} food entries for the selected meal in a day`
    });
  }

  const foodEntryTotalCalories = foodEntryInADay.reduce(
    (total, foodEntry) => total + foodEntry.calorie,
    0
  );

  const caloriesLimitPerDay = req.isAdmin
    ? (await User.findById(userId).select("caloriesLimitPerDay").lean().exec())
        .caloriesLimitPerDay
    : req.caloriesLimitPerDay;

  if (foodEntryTotalCalories + Number(calorie) > caloriesLimitPerDay) {
    return res.status(400).json({
      message: `You can only enter ${caloriesLimitPerDay} calories in a day`
    });
  }

  const foodEntry = await FoodEntry.create({
    foodName,
    calorie,
    date: newDate,
    meal: mealId,
    user: req.isAdmin ? userId : req.userId
  });

  if (foodEntry) {
    res.status(201).json({
      _id: foodEntry._id,
      foodName: foodEntry.foodName,
      calorie: foodEntry.calorie,
      date: foodEntry.date,
      meal: foodEntry.meal
    });
  } else {
    res.status(400).json({ message: "Invalid food entry data" });
  }
});

const updateFoodEntry = asyncHandler(async (req, res) => {
  const { foodName, calorie, date, mealId, userId } = req.body;

  if (req.isAdmin && !userId) {
    return res
      .status(400)
      .json({ message: "Please enter userId when updating food entry" });
  }

  if (date && !checkDateFormat(date)) {
    return res.status(400).json({
      message: "Please enter a valid date in the format of 'yyyy-MM-dd'"
    });
  }

  const foodEntry = await FoodEntry.findById(req.params.id);

  if (!foodEntry) {
    return res.status(404).json({ message: "Food entry not found" });
  }

  if (
    foodEntry.user.toString() !==
    (req.isAdmin ? userId.toString() : req.userId.toString())
  ) {
    return res.sendStatus(403);
  }

  const meal = await Meal.findById(mealId || foodEntry.meal)
    .where("user")
    .equals(req.isAdmin ? userId : req.userId)
    .lean()
    .exec();

  if (!meal) {
    return res.status(400).json({ message: "Invalid MealId" });
  }

  const foodEntryExists = await FoodEntry.findOne({ foodName, meal: mealId })
    .where("date")
    .equals(new Date(date || foodEntry.date).toISOString())
    .lean()
    .exec();

  if (foodEntryExists && foodEntryExists._id.toString() !== req.params.id) {
    return res.status(400).json({ message: "Food entry already exists" });
  }

  const foodEntryInADay = await FoodEntry.find({
    user: req.isAdmin ? userId : req.userId,
    date: new Date(date || foodEntry.date).toISOString()
  });

  const foodEntryMealCountInADay = foodEntryInADay.filter(
    foodEntry =>
      foodEntry.meal.toString() === mealId &&
      foodEntry._id.toString() !== req.params.id
  ).length;

  if (foodEntryMealCountInADay >= meal.maxFoodEntries) {
    return res.status(400).json({
      message: `You can only enter ${meal.maxFoodEntries} food entries for the selected meal in a day`
    });
  }

  const foodEntryTotalCalories = foodEntryInADay
    .filter(foodEntry => foodEntry._id.toString() !== req.params.id)
    .reduce((total, foodEntry) => total + foodEntry.calorie, 0);

  const caloriesLimitPerDay = req.isAdmin
    ? (await User.findById(userId).select("caloriesLimitPerDay").lean().exec())
        .caloriesLimitPerDay
    : req.caloriesLimitPerDay;

  if (foodEntryTotalCalories + Number(calorie) > caloriesLimitPerDay) {
    return res.status(400).json({
      message: `You can only enter ${caloriesLimitPerDay} calories in a day`
    });
  }

  foodEntry.foodName = foodName || foodEntry.foodName;
  foodEntry.calorie = calorie || foodEntry.calorie;
  foodEntry.date = date || foodEntry.date;
  foodEntry.meal = mealId || foodEntry.meal;
  foodEntry.user = req.isAdmin ? userId : req.userId;

  const updatedFoodEntry = await foodEntry.save();

  res.json({
    _id: updatedFoodEntry._id,
    foodName: updatedFoodEntry.foodName,
    calorie: updatedFoodEntry.calorie,
    date: updatedFoodEntry.date,
    meal: updatedFoodEntry.meal
  });
});

const deleteFoodEntry = asyncHandler(async (req, res) => {
  const foodEntry = await FoodEntry.findById(req.params.id);

  if (!foodEntry) {
    return res.status(404).json({ message: "Food entry not found" });
  }

  if (!req.isAdmin && foodEntry.user.toString() !== req.userId.toString()) {
    return res.sendStatus(403);
  }

  await foodEntry.remove();
  res.json({ message: "Food Entry removed" });
});

module.exports = {
  getAllFoodEntries,
  createFoodEntry,
  updateFoodEntry,
  deleteFoodEntry
};
