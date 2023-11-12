import { combineReducers } from "@reduxjs/toolkit";

import { authReducer } from "@/features/auth";
import { notificationsReducer } from "@/features/notifications";

const rootReducer = combineReducers({
  notifications: notificationsReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
