import { createSlice } from "@reduxjs/toolkit";

const initialState = []; // Initialize with an empty array

export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.find((item) => item.id === newItem.id);
      if (existingItem) {
          existingItem.quantity += newItem.quantity;
      } else {
          state.push(newItem);
      }
  },
    removeFromCart: (state, action) => {
      const id = action.payload;
      return state.filter((item) => item.id !== id);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
  },
});

export const { addToCart, removeFromCart,updateQuantity  } = cartSlice.actions;

export default cartSlice.reducer;
