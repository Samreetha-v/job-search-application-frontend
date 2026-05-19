import { combineReducers } from "@reduxjs/toolkit";

import auth from "./auth";
import job from "./job";
import application from "./application";
import alert from "./alert";

export default combineReducers({
  auth,
  job,
  application,
  alert,
});
