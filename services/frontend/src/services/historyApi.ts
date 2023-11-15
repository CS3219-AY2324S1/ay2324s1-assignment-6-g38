import { rootApi } from "@/app/RootApi.ts";

import type { History, HistoryFilter } from "@/features/users";

rootApi.enhanceEndpoints({ addTagTypes: ["History"] });

const buildServiceUrl = (queryUrl: string) =>
  `${process.env.NEXT_PUBLIC_SERVICE_HISTORY_URL}${queryUrl}`;

const historyApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getHistory: builder.query<History[], Partial<HistoryFilter> | void>({
      query: (historyQuery) => ({
        url: buildServiceUrl("/history"),
        method: "GET",
        params: { ...historyQuery },
      }),
      // @ts-expect-error
      providesTags: ["History"],
    }),
    addHistory: builder.mutation<History, Omit<History, "id" | "timestamp">>({
      query: (newHistory) => ({
        url: buildServiceUrl("/history"),
        method: "POST",
        body: newHistory,
      }),
      // @ts-expect-error
      invalidatesTags: ["History"],
    }),
    // deleteHistory: builder.mutation<void, string>({
    //   query: (historyId) => ({
    //     url: buildServiceUrl(`/history/${historyId}`),
    //     method: "DELETE",
    //   }),
    //   // @ts-expect-error
    //   invalidatesTags: ["History"],
    // }),
  }),
  overrideExisting: false,
});

export const {
  useGetHistoryQuery,
  useAddHistoryMutation,
  // useDeleteHistoryMutation,
} = historyApi;
