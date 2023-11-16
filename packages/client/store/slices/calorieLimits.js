import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  calorieLimits: []
};

export const calorieLimitsSlice = createSlice({
  name: "calorieLimits",
  initialState,
  reducers: {
    setCalorieLimits: (state, action) => {
      state.calorieLimits = action.payload.map(calorieLimit => ({
        date: calorieLimit.date,
        calorie: calorieLimit.calorie
      }));
    },
    resetCalorieLimits: () => {
      return initialState;
    }
  }
});

export const { setCalorieLimits, resetCalorieLimits } =
  calorieLimitsSlice.actions;

export default calorieLimitsSlice.reducer;
