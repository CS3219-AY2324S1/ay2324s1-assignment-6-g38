// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// initialize an empty api service that we'll inject endpoints into later as needed
export const rootApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:2000" }),
  endpoints: () => ({}),
});

// TODO take for .env