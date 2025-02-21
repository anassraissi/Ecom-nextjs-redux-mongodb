import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      return action.payload; // Set the loading state to the action payload
    },
  },
});

export const { setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
