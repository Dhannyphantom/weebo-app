import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: {},
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateToken(state, action) {
      state.token = action.payload;
    },
  },
});

export const { updateToken } = usersSlice.actions;
export default usersSlice.reducer;
