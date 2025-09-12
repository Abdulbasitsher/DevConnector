
// src/slices/alertSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const alertSlice = createSlice({
  name: "alert",
  initialState: [],
  reducers: {
    setAlert: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: (msg, alertType, timeout = 5000) => {
        const id = uuidv4();
        return { payload: { id, msg, alertType, timeout } };
      },
    },
    removeAlert: (state, action) =>
      state.filter((alert) => alert.id !== action.payload),
  },
});

export const { setAlert, removeAlert } = alertSlice.actions;

// Thunk for auto-removing alerts
export const showAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  const action = setAlert(msg, alertType, timeout);
  dispatch(action);
  setTimeout(() => dispatch(removeAlert(action.payload.id)), timeout);
};

export default alertSlice.reducer;