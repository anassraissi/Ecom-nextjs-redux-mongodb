'use client'
import store from '@/redux/store';
import React from 'react'
import { Provider } from "react-redux";
import "./globals.css";
import { Toaster } from 'react-hot-toast';




export const App = ({children}) => {
  return (
    <Provider store={store}>
    {children}
    <Toaster position="bottom-right" /> {/* Configure position here */}
  </Provider>  )
}
