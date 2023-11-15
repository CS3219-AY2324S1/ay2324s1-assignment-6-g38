"use client";

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";

import AuthenticationLayer from "./AuthenticationLayer.tsx";
import store from "./store.ts";

type Props = {
  children?: React.ReactNode;
};

export const Providers = ({ children }: Props) => (
  <Provider store={store}>
    <SessionProvider>
      <AuthenticationLayer>{children}</AuthenticationLayer>
    </SessionProvider>
  </Provider>
);

export default Providers;
