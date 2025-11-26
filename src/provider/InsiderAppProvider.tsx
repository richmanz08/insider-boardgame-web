"use client";

import React, { ReactNode } from "react";

import { PrimeReactProvider } from "primereact/api";
import ReduxProvider from "./Redux";
import LayoutProvider from "./Layout";
import { AuthGuard } from "@/src/provider/AuthGuard";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <PrimeReactProvider value={{ ripple: true }}>
        <LayoutProvider>
          <AuthGuard>{children}</AuthGuard>
        </LayoutProvider>
      </PrimeReactProvider>
    </ReduxProvider>
  );
}
