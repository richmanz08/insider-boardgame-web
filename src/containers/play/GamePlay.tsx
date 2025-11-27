"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tip } from "./Tip";
import { RoleAssignment } from "./Play";
import { RoleGame } from "@/src/hooks/interface";
import { usePlayHook } from "./hook";

interface GamePlayProps {
  myRole: RoleAssignment;
  timeRemaining: number;
  onTimeUp: () => void;
  onEndGame?: () => void; // Master สามารถจบเกมได้ก่อนเวลาหมด
}

export const GamePlay: React.FC<GamePlayProps> = ({
  myRole,
  timeRemaining,
  onTimeUp,
  onEndGame,
}) => {
  const { getRoleDisplay } = usePlayHook();
  const [showRole, setShowRole] = useState(true);
  const [showEndGameConfirm, setShowEndGameConfirm] = useState(false);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const roleDisplay = getRoleDisplay(myRole.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pb-8">
      {/* Timer Bar - Fixed at Top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <i className="pi pi-clock text-white text-xl" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">เวลาที่เหลือ</p>
                <p
                  className={`text-4xl font-bold tabular-nums ${
                    timeRemaining <= 60
                      ? "text-red-500 animate-pulse"
                      : timeRemaining <= 180
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  {formatTime(timeRemaining)}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">สถานะเกม</p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    timeRemaining > 0
                      ? "bg-green-500 animate-pulse"
                      : "bg-red-500"
                  }`}
                />
                <p className="text-lg font-semibold text-white">
                  {timeRemaining > 0 ? "กำลังเล่น" : "หมดเวลา"}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${
                timeRemaining <= 60
                  ? "bg-gradient-to-r from-red-600 to-red-400"
                  : timeRemaining <= 180
                  ? "bg-gradient-to-r from-yellow-600 to-yellow-400"
                  : "bg-gradient-to-r from-green-600 to-green-400"
              }`}
              style={{ width: `${(timeRemaining / 600) * 100}%` }}
            >
              <div className="w-full h-full animate-pulse" />
            </div>
          </div>

          {/* Time warnings */}
          {timeRemaining <= 60 && timeRemaining > 0 && (
            <div className="mt-2 text-center">
              <p className="text-sm text-red-400 animate-pulse font-semibold">
                <i className="pi pi-exclamation-triangle mr-2" />
                เหลือเวลาไม่ถึง 1 นาที!
              </p>
            </div>
          )}

          {/* Master End Game Button */}
          {myRole.role === RoleGame.MASTER && onEndGame && (
            <div className="mt-3 text-center">
              <Button
                label="จบเกม (มีคนตอบถูกแล้ว)"
                icon="pi pi-check-circle"
                severity="success"
                size="small"
                onClick={() => setShowEndGameConfirm(true)}
              />
            </div>
          )}
        </div>
      </div>

      {/* End Game Confirmation Modal */}
      {showEndGameConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowEndGameConfirm(false)}
          />
          <Card className="relative z-[201] max-w-md mx-4 bg-gray-800 border-2 border-gray-600">
            <div className="p-6 text-center">
              <i className="pi pi-question-circle text-yellow-400 text-5xl mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">
                ยืนยันจบเกม?
              </h3>
              <p className="text-gray-300 mb-6">
                แน่ใจหรือไม่ว่ามีผู้เล่นตอบถูกแล้ว?
                <br />
                เกมจะไปสู่ขั้นตอนการโหวตหา Insider
              </p>
              <div className="flex gap-3">
                <Button
                  label="ยกเลิก"
                  icon="pi pi-times"
                  severity="secondary"
                  outlined
                  onClick={() => setShowEndGameConfirm(false)}
                  className="flex-1"
                />
                <Button
                  label="จบเกม"
                  icon="pi pi-check"
                  severity="success"
                  onClick={() => {
                    setShowEndGameConfirm(false);
                    onEndGame?.();
                  }}
                  className="flex-1"
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-32 max-w-6xl">
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              <i className="pi pi-id-card mr-2" />
              บทบาทของคุณ
            </h2>
            <Button
              label={showRole ? "ซ่อน" : "แสดง"}
              icon={showRole ? "pi pi-eye-slash" : "pi pi-eye"}
              size="small"
              outlined
              onClick={() => setShowRole(!showRole)}
              className="text-sm"
            />
          </div>

          {showRole && (
            <Card
              className={`bg-gradient-to-br ${roleDisplay.bgColor} border-2 border-opacity-50 animate-fade-in`}
            >
              <div className="p-4">
                {/* Role Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-900 bg-opacity-50 flex items-center justify-center border border-gray-600">
                    <i
                      className={`pi ${roleDisplay.icon} text-white text-3xl`}
                    />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-1">
                      {roleDisplay.name}
                    </h3>
                    <p className="text-gray-200 text-sm">
                      {roleDisplay.description}
                    </p>
                  </div>
                </div>

                {/* Role Information */}
                {myRole.role !== RoleGame.CITIZEN && (
                  <div className="space-y-4">
                    {/* Image Display - Only for Master */}
                    {myRole.role === RoleGame.MASTER && myRole.answer && (
                      <div className="bg-gray-800 bg-opacity-60 rounded-lg p-4 overflow-hidden border border-gray-700">
                        <p className="text-gray-200 text-sm mb-3">รูปภาพ:</p>
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900">
                          <Image
                            src="/images/disneyland.png"
                            alt={myRole.answer || "Answer image"}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover rounded-lg"
                            priority
                          />
                        </div>
                      </div>
                    )}

                    {/* Answer Information */}
                    <div className="bg-gray-700 bg-opacity-70 rounded-lg p-4 border border-gray-600">
                      <p className="text-gray-200 text-sm mb-2">คำตอบ:</p>
                      <p className="text-white text-3xl font-bold">
                        {myRole.answer}
                      </p>
                    </div>

                    {/* Role specific instructions */}
                    {myRole.role === RoleGame.MASTER && (
                      <div className="bg-yellow-500 bg-opacity-20 rounded-lg p-4">
                        <p className="text-yellow-200 text-sm">
                          <i className="pi pi-info-circle mr-2" />
                          คุณต้องให้คำใบ้ผู้เล่นแต่ไม่ให้รู้คำตอบ
                        </p>
                      </div>
                    )}

                    {myRole.role === RoleGame.INSIDER && (
                      <div className="bg-red-500 bg-opacity-20 rounded-lg p-4">
                        <p className="text-red-200 text-sm">
                          <i className="pi pi-eye mr-2" />
                          คุณต้องบงการผู้เล่นให้ไปสู่คำตอบ แต่อย่าให้ถูกจับได้!
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {myRole.role === RoleGame.CITIZEN && (
                  <div className="bg-gray-800 bg-opacity-60 rounded-lg p-6 text-center border border-gray-700">
                    <i className="pi pi-question-circle text-white text-4xl mb-3" />
                    <p className="text-white text-xl font-semibold">
                      คุณไม่ทราบคำตอบ
                    </p>
                    <p className="text-gray-200 text-sm mt-2">
                      ใช้คำถามเพื่อค้นหาคำตอบ
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Game Tips */}
        <Tip />

        {/* Warning */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-yellow-900/30 border border-yellow-700 rounded-lg px-6 py-3">
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
