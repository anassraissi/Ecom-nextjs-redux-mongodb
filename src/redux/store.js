// store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cartSlice";
import loadingReducer from "./features/loadingSlice"; // Fixed naming convention
import productReducer from "./features/productSlice";

export const store = configureStore({
  reducer: {
    cartReducer, // Use keys without "Reducer" suffix for better clarity
     productReducer,
     loadingReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
