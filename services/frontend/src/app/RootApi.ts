// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const rootApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://",
  }),
  endpoints: () => ({}),
});
