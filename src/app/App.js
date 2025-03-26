'use client'
import store from '@/redux/store';
import React from 'react'
import { Provider } from "react-redux";
import "./globals.css";


export const App = ({children}) => {
  return (
    <Provider store={store}>
    {children}
  </Provider>  )
}
