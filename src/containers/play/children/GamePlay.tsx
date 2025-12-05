/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { Button } from "primereact/button";
import { RoleAssignment } from "../Play";
import { RoleCard } from "@/src/components/card/RoleCard";

interface GamePlayProps {
  myRole: RoleAssignment;
  timeRemaining: number;
  onTimeUp: () => void;
}

export const GamePlay: React.FC<GamePlayProps> = ({
  myRole,
  timeRemaining,
  onTimeUp,
}) => {
  const localStorageKey = localStorage.getItem("showRole");
  const [showRole, setShowRole] = useState(true);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  useLayoutEffect(() => {
    if (localStorageKey) {
      const isShow = localStorageKey === "yes";
      setShowRole(isShow);
    }
  }, [localStorageKey]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pb-8">
      {/* Main Content */}
      <div className="container mx-auto px-4 pt-8 max-w-6xl">
        {/* Game Instructions */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            เกมกำลังดำเนินอยู่
          </h1>
          <p className="text-gray-400 text-lg">
            คุยกันเพื่อหาคำตอบภายในเวลาที่กำหนด
          </p>
        </div>

        {/* Role Card - Can be toggled */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-xl font-bold text-white">
              <i className="pi pi-id-card mr-2" />
              บทบาทของคุณ
            </h2>
            <Button
              label={showRole ? "ซ่อน" : "แสดง"}
              icon={showRole ? "pi pi-eye-slash" : "pi pi-eye"}
              size="small"
              outlined
              onClick={() => {
                localStorage.setItem("showRole", !showRole ? "yes" : "no");
                setShowRole(!showRole);
              }}
              className="text-sm"
            />
          </div>

          {/* {showRole && ( */}
          <div className="flex justify-center">
            <RoleCard
              role={myRole.role}
              answer={myRole.answer ?? ""}
              visible={showRole}
              onFlipCard={() => {
                console.log("Toggle Role Card Visibility");

                localStorage.setItem("showRole", !showRole ? "yes" : "no");
                setShowRole(!showRole);
              }}
            />
          </div>
          {/* )} */}
        </div>

        {/* Warning */}
        <div className="mt-16 text-center">
          <div className="inline-block rounded-lg px-6 py-3">
            <p className="text-yellow-400 text-sm">
              <i className="pi pi-exclamation-triangle mr-2" />
              อย่าให้ผู้เล่นคนอื่นเห็นหน้าจอของคุณ!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
