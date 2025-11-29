import { useEffect, useRef, useState } from "react";

// ⭐ Component สำหรับปุ่มกดค้าง 2 วินาที
interface MasterEndGameButtonProps {
  onEndGame: () => void;
}

export const MasterEndGameButton: React.FC<MasterEndGameButtonProps> = ({
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
