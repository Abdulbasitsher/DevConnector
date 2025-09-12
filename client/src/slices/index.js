import { combineReducers } from "redux";
import alert from "./alertSlice.js"
import auth from './authSlice.js'

// put your reducers inside {}
const rootReducer = combineReducers({
  alert,
  auth
  // auth: authReducer,
  // posts: postReducer,
})

export default rootReducer
