import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  foodEntries: []
};

export const foodEntriesSlice = createSlice({
  name: "foodEntries",
  initialState,
  reducers: {
    setFoodEntries: (state, action) => {
      state.foodEntries = action.payload.map(foodEntry => ({
        _id: foodEntry._id,
        foodName: foodEntry.foodName,
        calorie: foodEntry.calorie,
        date: foodEntry.date,
        meal: foodEntry.meal,
        user: foodEntry.user
      }));
    },
    resetFoodEntries: () => {
      return initialState;
    }
  }
});

export const { setFoodEntries, resetFoodEntries } = foodEntriesSlice.actions;

export default foodEntriesSlice.reducer;
