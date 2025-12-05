"use client";
import React, { createContext, useContext } from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { FooterLayout } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
const LayoutContext = createContext({});
export const useLayout = () => useContext(LayoutContext);

interface Props {
  children: React.ReactNode;
}

export default function LayoutProvider({ children }: Props) {
  const me = useSelector((state: RootState) => state.me);
  return (
    <LayoutContext.Provider value={{}}>
      <div
        className={`pt-6 pb-2 px-2 min-h-screen flex flex-col justify-between`}
      >
        <div>
          {me.me && <Header />}
          <div>{children}</div>
        </div>

        <FooterLayout />
      </div>
    </LayoutContext.Provider>
  );
}
