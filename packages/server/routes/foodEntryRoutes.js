const express = require("express");
const router = express.Router();
const foodEntriesController = require("../controllers/foodEntriesController");

router
  .route("/")
  .get(foodEntriesController.getAllFoodEntries)
  .post(foodEntriesController.createFoodEntry);

router
  .route("/:id")
  .patch(foodEntriesController.updateFoodEntry)
  .delete(foodEntriesController.deleteFoodEntry);

module.exports = router;
