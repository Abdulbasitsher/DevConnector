import { combineReducers } from "redux";
import alert from "./alertSlice.js"
import auth from './authSlice.js'
import profile from './profileSlice.js'
// put your reducers inside {}
const rootReducer = combineReducers({
  alert,
  auth,
  profile
  // auth: authReducer,
  // posts: postReducer,
})

export default rootReducer
