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
  const STORAGE_KEY = "game-bar-time-show";

  // ⭐ อ่านค่าจาก localStorage (default = true)
  const [show, setShow] = React.useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored !== null ? stored === "true" : true;
    }
    return true;
  });

  // ⭐ บันทึกค่าลง localStorage เมื่อเปลี่ยน
  const handleToggle = () => {
    const newValue = !show;
    setShow(newValue);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, String(newValue));
    }
  };

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
      <div
        className={`container mx-auto px-4 transition-all duration-500 ease-in-out relative ${
          show ? "py-4" : "py-2"
        }`}
      >
        {/* เนื้อหาทั้งหมด - แสดงเมื่อเปิด */}
        <div
          className={`grid transition-all duration-500 ease-in-out ${
            show ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex items-center justify-between mb-3">
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

            {myRole.role === RoleGame.MASTER && (
              <div className="mb-3">
                <MasterEndGameButton onEndGame={actionMasterEndGame} />
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar - แสดงเสมอ */}
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden transition-all duration-500 ease-in-out">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${
              timeRemaining <= 60
                ? "bg-red-500"
                : timeRemaining <= 180
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
            style={{ width: `${(timeRemaining / 600) * 100}%` }}
          />
        </div>
        {/* ปุ่ม Toggle */}
        <div
          className={`absolute bottom-0 mb-[-42px] flex justify-center transition-all w-full duration-500 ease-in-out`}
        >
          <button
            type="button"
            className="p-2 w-full h-[50px] rounded-full transition-all duration-300 ease-in-out hover:scale-110"
            onClick={handleToggle}
            aria-label={show ? "ซ่อนรายละเอียด" : "แสดงรายละเอียด"}
          >
            <i
              className={`pi pi-chevron-up text-gray-400 transition-transform duration-500 ease-in-out ${
                show ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
