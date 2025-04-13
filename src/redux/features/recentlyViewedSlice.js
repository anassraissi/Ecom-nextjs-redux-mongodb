import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: {
    addToRecentlyViewed: (state, action) => {
      // Remove if already exists
      state.items = state.items.filter(item => item._id !== action.payload._id);
      // Add to beginning of array
      state.items.unshift(action.payload);
      // Keep only last 5 items
      if (state.items.length > 5) {
        state.items.pop();
      }
    },
    clearRecentlyViewed: (state) => {
      state.items = [];
    }
  }
});

export const { addToRecentlyViewed, clearRecentlyViewed } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;