// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import alertReducer from "./slices/alertSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    alert: alertReducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

export default store;