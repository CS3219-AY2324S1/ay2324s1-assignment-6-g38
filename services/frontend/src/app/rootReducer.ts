/* eslint-disable no-param-reassign */
import { combineReducers } from "@reduxjs/toolkit";

import { authReducer } from "@/features/auth";
import { matchReducer } from "@/features/match/state/matchSlice";
import { notificationsReducer } from "@/features/notifications";

const appReducer = combineReducers({
  notifications: notificationsReducer,
  auth: authReducer,
  match: matchReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "RESET_APP") {
    state = undefined;
  }

  return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
