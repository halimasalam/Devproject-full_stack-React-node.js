import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: []
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload
        .filter(user => !user.isAdmin)
        .map(user => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          caloriesLimitPerDay: user.caloriesLimitPerDay
        }));
    },
    resetUsers: () => {
      return initialState;
    }
  }
});

export const { setUsers, resetUsers } = usersSlice.actions;

export default usersSlice.reducer;
