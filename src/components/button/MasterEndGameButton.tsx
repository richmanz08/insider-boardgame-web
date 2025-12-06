import { useEffect, useRef, useState } from "react";
import { Typography } from "../text/Typography";

// ⭐ Component สำหรับปุ่มกดค้าง 2 วินาที
interface MasterEndGameButtonProps {
  onEndGame: () => void;
}

export const MasterEndGameButton: React.FC<MasterEndGameButtonProps> = ({
  onEndGame,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const HOLD_DURATION = 1500; // 1.5 วินาที

  const startProgress = () => {
    setIsPressed(true);
    setProgress(0);

    // ⭐ ใช้ callback เพื่อหลีกเลี่ยง linter warning
    queueMicrotask(() => {
      startTimeRef.current = performance.now();
    });

    // ⭐ ใช้ requestAnimationFrame แทน setInterval (smooth กว่า 60fps)
    const animate = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / HOLD_DURATION) * 100, 100);

      setProgress(newProgress);

      if (elapsed < HOLD_DURATION) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        onEndGame();
        resetProgress();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const resetProgress = () => {
    setIsPressed(false);
    setProgress(0);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="mt-3 text-center">
      <div
        className={`relative inline-block cursor-pointer select-none transition-all duration-200 min-w-[295px] ${
          isPressed ? "scale-105" : "scale-100 hover:scale-102"
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
            border-2 transition-all duration-150 ease-out
            ${
              isPressed
                ? "border-green-300 bg-green-700 shadow-xl shadow-green-500/50"
                : "border-green-500 bg-green-600 hover:bg-green-700 hover:border-green-400 shadow-lg hover:shadow-green-500/30"
            }
          `}
        >
          {/* Progress Background - ⭐ smooth transition */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300"
            style={{
              width: `${progress}%`,
              opacity: isPressed ? 0.7 : 0,
              transition: "opacity 0.15s ease-out",
            }}
          />

          {/* Pulse Effect when pressed */}
          {isPressed && (
            <div className="absolute inset-0 animate-pulse bg-green-300 opacity-20" />
          )}

          {/* Button Content */}
          <div className="relative flex items-center justify-center gap-2 text-white font-semibold">
            <i
              className={`pi pi-check-circle text-lg transition-transform duration-150 ${
                isPressed ? "scale-110" : ""
              }`}
            />
            <span className="text-sm">
              {isPressed
                ? `กำลังจบเกม... ${
                    Math.ceil(
                      ((HOLD_DURATION - (progress * HOLD_DURATION) / 100) /
                        1000) *
                        10
                    ) / 10
                  }s`
                : "กดค้างเพื่อจบเกม (มีคนตอบถูกแล้ว)"}
            </span>
          </div>
        </div>
      </div>

      {/* Instruction Text */}

      <Typography type="small" className="text-gray-400 mt-2">
        กดค้างไว้ {HOLD_DURATION / 1000} วินาที เพื่อจบเกม
      </Typography>
    </div>
  );
};
