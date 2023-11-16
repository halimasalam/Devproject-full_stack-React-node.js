import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  meals: []
};

export const mealsSlice = createSlice({
  name: "meals",
  initialState,
  reducers: {
    setMeals: (state, action) => {
      state.meals = action.payload.map(meal => ({
        _id: meal._id,
        name: meal.name,
        maxFoodEntries: meal.maxFoodEntries,
        user: meal.user
      }));
    },
    resetMeals: () => {
      return initialState;
    }
  }
});

export const { setMeals, resetMeals } = mealsSlice.actions;

export default mealsSlice.reducer;
