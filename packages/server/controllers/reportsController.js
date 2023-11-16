const User = require("../models/User");
const FoodEntry = require("../models/FoodEntry");
const asyncHandler = require("express-async-handler");
const formatISO = require("date-fns/formatISO");
const sub = require("date-fns/sub");
const ROLES = require("../configs/roles");

const getRecentFoodEntriesCount = asyncHandler(async (_req, res) => {
  const currentWeekStartDate = sub(new Date(), {
    days: 7
  });

  const lastWeekStartDate = sub(new Date(), {
    days: 14
  });

  const currentWeekFoodEntries = await FoodEntry.find({
    date: { $gt: formatISO(currentWeekStartDate, { representation: "date" }) }
  }).count();

  const lastWeekFoodEntries = await FoodEntry.find({
    date: {
      $gt: formatISO(lastWeekStartDate, { representation: "date" }),
      $lte: formatISO(currentWeekStartDate, { representation: "date" })
    }
  }).count();

  res.status(200).json({
    currentWeekFoodEntries,
    lastWeekFoodEntries
  });
});

const getAverageCaloriesPerUser = asyncHandler(async (_req, res) => {
  const users = await User.find({ role: ROLES.user });
  const averageCaloriesPerUser = [];
  const currentWeekStartDate = sub(new Date(), {
    days: 7
  });

  for (const user of users) {
    const userFoodEntries = await FoodEntry.find({
      user: user._id,
      date: { $gt: formatISO(currentWeekStartDate, { representation: "date" }) }
    });

    const userCalories = userFoodEntries.reduce((acc, foodEntry) => {
      return acc + foodEntry.calorie;
    }, 0);

    const averageCalories = Number(
      (userCalories / userFoodEntries.length).toFixed(2)
    );

    averageCaloriesPerUser.push({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      averageCalories: averageCalories || 0
    });
  }

  averageCaloriesPerUser.sort((a, b) => b.averageCalories - a.averageCalories);

  res.status(200).json(averageCaloriesPerUser);
});

const getCaloriesLimitPerDay = asyncHandler((req, res) => {
  if (req.isAdmin) return res.json([]);

  FoodEntry.aggregate([
    {
      $match: {
        user: { $eq: req.userId }
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
        },
        calorie: { $sum: "$calorie" }
      }
    },
    {
      $sort: { _id: -1 }
    }
  ]).exec((err, result) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    const caloriesLimitPerDay = result
      .map(({ _id, calorie }) => ({
        date: _id.date,
        calorie: Number(calorie.toFixed(3))
      }))
      .filter(({ calorie }) => calorie >= req.caloriesLimitPerDay);

    res.status(200).json(caloriesLimitPerDay);
  });
});

module.exports = {
  getRecentFoodEntriesCount,
  getAverageCaloriesPerUser,
  getCaloriesLimitPerDay
};
