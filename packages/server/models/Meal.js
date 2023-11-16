const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mealSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    maxFoodEntries: {
      type: Number,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Meal", mealSchema);
