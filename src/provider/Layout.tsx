"use client";
import React, { createContext, useContext } from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
const LayoutContext = createContext({});
export const useLayout = () => useContext(LayoutContext);

interface Props {
  children: React.ReactNode;
}

export default function LayoutProvider({ children }: Props) {
  const me = useSelector((state: RootState) => state.me);
  return (
    <LayoutContext.Provider value={{}}>
      <div className={`${me.name ? "py-[100px]" : "pb-[50px]"}  mb-16 px-6`}>
        {children}
      </div>
    </LayoutContext.Provider>
  );
}
