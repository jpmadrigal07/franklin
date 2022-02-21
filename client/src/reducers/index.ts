import { combineReducers } from "redux";
import authenticatedUserReducer from "./authenticatedUserReducers";

export default combineReducers({
  authenticatedUser: authenticatedUserReducer,
});
