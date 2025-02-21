import { createSlice } from "@reduxjs/toolkit";

const initialState = []; // Initialize with an empty array

export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      if (state.findIndex((pro) => pro.id === action.payload.id) === -1) {
        state.push(action.payload);
      } else {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
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
