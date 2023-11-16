const express = require("express");
const router = express.Router();
const mealsController = require("../controllers/mealsController");

router
  .route("/")
  .get(mealsController.getAllMeals)
  .post(mealsController.createMeal);

router
  .route("/:id")
  .patch(mealsController.updateMeal)
  .delete(mealsController.deleteMeal);

module.exports = router;
