const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const isAdmin = require("../middlewares/isAdmin");

router
  .route("/")
  .get(isAdmin, usersController.getAllUsers)
  .post(isAdmin, usersController.createUser)

router
  .route("/:id")
  .get(isAdmin, usersController.getUserById)
  .patch(isAdmin, usersController.updateUser)
  .delete(isAdmin, usersController.deleteUser);

module.exports = router;
