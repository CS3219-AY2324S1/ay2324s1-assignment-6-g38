/* eslint-disable no-param-reassign */

import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { MatchDetails, MatchState } from "..";

const initialState: MatchState = {
  question: undefined,
  roomId: undefined,
  language: undefined,
  hasOngoingSession: false,
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    updateMatchDetails: (state, action: PayloadAction<MatchDetails>) => {
      state.language = action.payload.language;
      state.roomId = action.payload.roomId;
      state.question = action.payload.question;
      state.hasOngoingSession = true;
    },
    updateSessionEnded: (state) => {
      state.hasOngoingSession = false;
    },
    resetMatchDetails: () => initialState,
  },
});

export const { resetMatchDetails, updateSessionEnded, updateMatchDetails } =
  matchSlice.actions;
export const { reducer: matchReducer } = matchSlice;
