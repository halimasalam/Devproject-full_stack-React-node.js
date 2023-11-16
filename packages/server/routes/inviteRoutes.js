const express = require("express");
const router = express.Router();
const { inviteFriend } = require("../controllers/inviteController");

router.post("/", inviteFriend);

module.exports = router;
