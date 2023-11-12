import { configureStore } from "@reduxjs/toolkit";

import { rootApi } from "./RootApi";
import rootReducer from "./rootReducer";

const store = configureStore({
  reducer: {
    internal: rootReducer,
    [rootApi.reducerPath]: rootApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(rootApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
