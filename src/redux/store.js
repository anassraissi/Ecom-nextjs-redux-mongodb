// store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cartSlice";
import loadingReducer from "./features/loadingSlice"; // Fixed naming convention
import productReducer from "./features/productSlice";
import userReducer from "./features/userSlice";
import categoryReducer from "./features/categorySlice";
import brandReducer from "./features/brandSlice";


export const store = configureStore({
  reducer: {
    cartReducer, // Use keys without "Reducer" suffix for better clarity
     productReducer,
     loadingReducer,
     userReducer,
     categoryReducer,
     brandReducer
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
