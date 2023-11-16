const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const foodEntrySchema = new Schema(
  {
    foodName: {
      type: String,
      required: true
    },
    calorie: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: new Date().toISOString().slice(0, 10)
    },
    meal: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Meal"
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

module.exports = mongoose.model("FoodEntry", foodEntrySchema);
