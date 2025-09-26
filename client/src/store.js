// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import alertReducer from "./slices/alertSlice";
import authReducer from "./slices/authSlice";
import profileReducer from './slices/profileSlice'

const store = configureStore({
  reducer: {
    alert: alertReducer,
    auth: authReducer,
    profile: profileReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

export default store;