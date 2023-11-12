import { signIn as NextSignIn, signOut as NextSignOut } from "next-auth/react";

import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { User } from "@/features/users";

import type { AuthenticationDetails } from "../types/authentication.type";

const initialState: AuthenticationDetails = {
  currentUser: null,
  image: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionSignIn: (state, action: PayloadAction<AuthenticationDetails>) =>
      action.payload,
    signIn: () => {
      NextSignIn("github", { redirect: true });
    },
    signOut: () => {
      NextSignOut({ callbackUrl: "/" });
      return {
        currentUser: null,
        image: null,
        isLoggedIn: false,
      };
    },
    register: (state, action: PayloadAction<User>) => ({
      ...state,
      currentUser: action.payload,
    }),
  },
});

export const { signIn, signOut, sessionSignIn, register } = authSlice.actions;
export const { reducer: authReducer } = authSlice;
