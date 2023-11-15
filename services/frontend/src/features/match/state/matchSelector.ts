import type { RootState } from "@/app/store";

export const selectMatchState = (state: RootState) => state.internal.match;
