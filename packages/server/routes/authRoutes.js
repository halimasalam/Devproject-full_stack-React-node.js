const express = require("express");
const router = express.Router();
const { login, generateUserToken } = require("../controllers/authController");

router.post("/login", login);
router.post("/token", generateUserToken);

module.exports = router;
