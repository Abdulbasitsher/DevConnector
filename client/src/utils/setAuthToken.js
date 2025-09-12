// src/utils/setAuthToken.js
import axios from "axios";

const setAuthToken = (token) => {
  if (token) {
    // ✅ If token exists, set it in Axios default headers
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    // ❌ If no token, delete it from headers
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
