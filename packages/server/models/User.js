const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ROLES = require("../configs/roles");

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: ROLES.user,
    enum: [ROLES.admin, ROLES.user]
  },
  token: {
    type: String,
    default: ""
  },
  caloriesLimitPerDay: {
    type: Number,
    default: 2.1
  }
});

module.exports = mongoose.model("User", userSchema);
