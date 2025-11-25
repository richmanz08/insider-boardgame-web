"use client";

import React, { ReactNode } from "react";

import { PrimeReactProvider } from "primereact/api";
import ReduxProvider from "./Redux";
import LayoutProvider from "./Layout";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <PrimeReactProvider value={{ ripple: true }}>
        <LayoutProvider>{children}</LayoutProvider>
      </PrimeReactProvider>
    </ReduxProvider>
  );
}
