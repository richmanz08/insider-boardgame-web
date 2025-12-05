import { RoleGame } from "@/src/hooks/interface";
import { RoleAssignment } from "../Play";
import React from "react";
import { MasterEndGameButton } from "@/src/components/button/MasterEndGameButton";

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
