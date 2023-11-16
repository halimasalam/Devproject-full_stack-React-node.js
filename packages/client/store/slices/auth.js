import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { resetAverageCalories } from "./averageCalories";
import { resetCalorieLimits } from "./calorieLimits";
import { resetFoodEntries } from "./foodEntries";
import { resetMeals } from "./meals";
import { resetUsers } from "./users";

const initialState = {
  email: "",
  isAdmin: false,
  name: "",
  token: "",
  isAuthenticated: false,
  caloriesLimitPerDay: null
};

export const logout = createAsyncThunk("auth/logout", (_, { dispatch }) => {
  dispatch(resetAverageCalories());
  dispatch(resetCalorieLimits());
  dispatch(resetFoodEntries());
  dispatch(resetMeals());
  dispatch(resetUsers());
  return initialState;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.email = action.payload.email;
      state.isAdmin = action.payload.isAdmin;
      state.name = action.payload.name;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.caloriesLimitPerDay = action.payload.caloriesLimitPerDay;
    }
  },
  extraReducers: builder => {
    builder.addCase(logout.fulfilled, (_state, action) => {
      return action.payload;
    });
  }
});

export const { login } = authSlice.actions;

export default authSlice.reducer;
