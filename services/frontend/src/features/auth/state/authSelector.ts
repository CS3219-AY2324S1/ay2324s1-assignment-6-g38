import type { RootState } from "@/app/store";

export const selectAuthData = (state: RootState) => state.internal.auth;
