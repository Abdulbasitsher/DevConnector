// src/App.js
import React, { Fragment, useEffect } from "react";
import "./App.css";
import Navbar from "./Components/layout/Navbar";
import LandingPage from "./Components/layout/LandingPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
import Alert from "./Components/layout/alert";
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./slices/authSlice";  // <-- import action
import setAuthToken from "./utils/setAuthToken"; // <-- helper to set axios headers
import Dashboard from "./Components/dashboard/Dashboard";
import ProtectedRoute from './Components/routing/ProtectedRoute';

// If there's a token in localStorage, set it globally before anything else
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  useEffect(() => {
    // dispatch loadUser once when the app mounts
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <main className="container" style={{ marginTop: "70px" }}>
            <Alert />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <Dashboard/>
                </ProtectedRoute>
              }/>
            </Routes>
          </main>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
