"use client";

import React, { ReactNode } from "react";

import { PrimeReactProvider } from "primereact/api";
import ReduxProvider from "./Redux";
import LayoutProvider from "./Layout";
import { AuthGuard } from "@/src/provider/AuthGuard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/src/contexts/ToastContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes: data considered "fresh"
      // 10 minutes: data stays in cache after unused
      refetchOnWindowFocus: false, // don't refetch when tab is refocused
      retry: 1, // retry failed requests once
    },
  },
});
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <QueryClientProvider client={queryClient}>
        <PrimeReactProvider value={{ ripple: true }}>
          <ToastProvider>
            <LayoutProvider>
              <AuthGuard>{children}</AuthGuard>
            </LayoutProvider>
          </ToastProvider>
        </PrimeReactProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
