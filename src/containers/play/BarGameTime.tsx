import { RoleGame } from "@/src/hooks/interface";
import { RoleAssignment } from "./Play";
import React, { useState, useRef, useEffect } from "react";

interface BarGameTimeProps {
  isStarted: boolean;
  timeRemaining: number; // เวลาเหลือเป็นวินาที
  myRole: RoleAssignment;
  actionMasterEndGame: () => void;
}
export const BarGameTime: React.FC<BarGameTimeProps> = ({
  timeRemaining,
  isStarted,
  myRole,
  actionMasterEndGame,
}) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  if (!isStarted) {
    return null;
  }
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-700 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <i className="pi pi-clock text-2xl text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">เวลาที่เหลือ</p>
              <p
                className={`text-3xl font-bold ${
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
            <p className="text-sm text-gray-400">สถานะ</p>
            <p className="text-lg font-semibold text-green-400">
              <i className="pi pi-play-circle mr-2" />
              กำลังเล่น
            </p>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              timeRemaining <= 60
                ? "bg-red-500"
                : timeRemaining <= 180
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
            style={{ width: `${(timeRemaining / 600) * 100}%` }}
          />
        </div>
        {myRole.role === RoleGame.MASTER && (
          <MasterEndGameButton onEndGame={actionMasterEndGame} />
        )}
      </div>
    </div>
  );
};

// ⭐ Component สำหรับปุ่มกดค้าง 2 วินาที
interface MasterEndGameButtonProps {
  onEndGame: () => void;
}

const MasterEndGameButton: React.FC<MasterEndGameButtonProps> = ({
  onEndGame,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const HOLD_DURATION = 2000; // 2 วินาที

  const startProgress = () => {
    setIsPressed(true);
    setProgress(0);

    // อัปเดต progress ทุก 50ms
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (50 / HOLD_DURATION) * 100;
        return Math.min(newProgress, 100);
      });
    }, 50);

    // จบเกมหลัง 2 วินาที
    timerRef.current = setTimeout(() => {
      onEndGame();
      resetProgress();
    }, HOLD_DURATION);
  };

  const resetProgress = () => {
    setIsPressed(false);
    setProgress(0);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="mt-3 text-center">
      <div
        className={`relative inline-block cursor-pointer select-none transition-transform duration-150 ${
          isPressed ? "scale-95" : "scale-100"
        }`}
        onMouseDown={startProgress}
        onMouseUp={resetProgress}
        onMouseLeave={resetProgress}
        onTouchStart={startProgress}
        onTouchEnd={resetProgress}
      >
        {/* Background Button */}
        <div
          className={`
            relative overflow-hidden rounded-lg px-6 py-3 
            border-2 transition-all duration-200
            ${
              isPressed
                ? "border-green-400 bg-green-800 shadow-lg"
                : "border-green-500 bg-green-600 hover:bg-green-700 shadow-md"
            }
          `}
        >
          {/* Progress Background */}
          <div
            className="absolute inset-0 bg-green-400 transition-all duration-75 ease-linear"
            style={{
              width: `${progress}%`,
              opacity: isPressed ? 0.6 : 0,
            }}
          />

          {/* Button Content */}
          <div className="relative flex items-center gap-2 text-white font-semibold">
            <i className="pi pi-check-circle text-lg" />
            <span className="text-sm">
              {isPressed
                ? `จบเกม (${Math.ceil((100 - progress) / 50)}s)`
                : "กดค้างเพื่อจบเกม (มีคนตอบถูกแล้ว)"}
            </span>
          </div>
        </div>

        {/* Progress Indicator */}
        {isPressed && (
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-300 transition-all duration-75 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Instruction Text */}
      {!isPressed && (
        <p className="text-xs text-gray-400 mt-2">
          กดค้างไว้ 2 วินาที เพื่อจบเกม
        </p>
      )}
    </div>
  );
};
