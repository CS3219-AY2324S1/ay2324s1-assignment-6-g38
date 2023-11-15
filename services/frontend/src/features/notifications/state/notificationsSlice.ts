/* eslint-disable no-param-reassign */
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type {
  NotificationPayload,
  NotificationState,
} from "../types/notification.type";

const initialState: NotificationState = {
  value: null,
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<NotificationPayload>) => {
      state.value = action.payload;
    },
    resetNotification: (state) => {
      state.value = initialState.value;
    },
  },
});

export const { setNotification, resetNotification } =
  notificationsSlice.actions;

export const { reducer: notificationsReducer } = notificationsSlice;
