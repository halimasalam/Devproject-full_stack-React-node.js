import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  averageCalories: []
};

export const averageCaloriesSlice = createSlice({
  name: "averageCalories",
  initialState,
  reducers: {
    setAverageCalories: (state, action) => {
      state.averageCalories = action.payload.map(data => ({
        _id: data.user._id,
        name: data.user.name,
        averageCalories: data.averageCalories
      }));
    },
    resetAverageCalories: () => {
      return initialState;
    }
  }
});

export const { setAverageCalories, resetAverageCalories } =
  averageCaloriesSlice.actions;

export default averageCaloriesSlice.reducer;
