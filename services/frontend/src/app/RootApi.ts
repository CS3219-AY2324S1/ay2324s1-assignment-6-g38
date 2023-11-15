// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { RootState } from "./store";

export const rootApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.internal.auth.sessionToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
