const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsController");
const isAdmin = require("../middlewares/isAdmin");

router.get(
  "/getRecentFoodCount",
  isAdmin,
  reportsController.getRecentFoodEntriesCount
);

router.get(
  "/getAverageCaloriesPerUser",
  isAdmin,
  reportsController.getAverageCaloriesPerUser
);

router.get("/getCaloriesLimitPerDay", reportsController.getCaloriesLimitPerDay);

module.exports = router;
