import { usePlayHook } from "@/src/containers/play/hook";
import { RoleAssignment } from "@/src/containers/play/Play";
import { ActiveGame, RoleGame } from "@/src/hooks/interface";
import { Card } from "primereact/card";
import React, { useEffect, useMemo, useState, useRef } from "react";

interface DraftRoleCardProps {
  isCardFlipped: boolean;
  onFlipCard: () => void;
  my: RoleAssignment;
  activeGame: ActiveGame;
}

export const DraftRoleCard: React.FC<DraftRoleCardProps> = ({
  isCardFlipped,
  onFlipCard,
  my,
  activeGame,
}) => {
  const { getRoleDisplay } = usePlayHook();

  const keySessionStartCountdown = `dcds_${activeGame.id}`;
  const keySessionEndCountdown = `dcde_${activeGame.id}`;

  const DELAY = 15; // วินาที
  const hasFlippedRef = useRef(false); // ⭐ ป้องกัน flip ซ้ำ

  // -----------------------------------------------------
  // INITIAL COUNTDOWN (อ่านจาก sessionStorage)
  // -----------------------------------------------------
  const [countdown, setCountdown] = useState(() => {
    const getStoredEnd = sessionStorage.getItem(keySessionEndCountdown);

    if (getStoredEnd) {
      const endTime = parseInt(getStoredEnd, 10);
      const now = Date.now();
      const diffSeconds = Math.ceil((endTime - now) / 1000);

      if (diffSeconds > 0 && diffSeconds <= DELAY) {
        return diffSeconds;
      }
      if (diffSeconds <= 0) {
        return 0;
      }
    }

    // ไม่เจอใน sessionStorage → ตั้งใหม่
    const newEndTime = Date.now() + DELAY * 1000;
    sessionStorage.setItem(keySessionEndCountdown, newEndTime.toString());

    return DELAY;
  });

  // -----------------------------------------------------
  // ⭐ COUNTDOWN EFFECT (ใช้ timestamp แทน setTimeout)
  // -----------------------------------------------------
  useEffect(() => {
    if (isCardFlipped) {
      hasFlippedRef.current = false; // Reset เมื่อการ์ดถูกเปิดแล้ว
      return;
    }

    const storedEndTime = sessionStorage.getItem(keySessionEndCountdown);
    if (!storedEndTime) return;

    const endTime = parseInt(storedEndTime, 10);
    let isComponentMounted = true;
    let flipTimeoutId: NodeJS.Timeout | null = null;

    const triggerFlipCard = () => {
      if (!hasFlippedRef.current && !isCardFlipped) {
        hasFlippedRef.current = true;

        sessionStorage.removeItem(keySessionStartCountdown);
        sessionStorage.removeItem(keySessionEndCountdown);

        // ⭐ เก็บ timeout ID เพื่อ cleanup
        flipTimeoutId = setTimeout(() => {
          if (isComponentMounted && !isCardFlipped) {
            console.log("🎴 Auto-flipping card after countdown");
            onFlipCard();
          }
        }, 1000);
      }
    };

    const updateCountdown = () => {
      if (!isComponentMounted) return;

      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));

      setCountdown(remaining);

      // ⭐ เมื่อหมดเวลา
      if (remaining <= 0) {
        triggerFlipCard();
      }
    };

    // อัปเดททันทีและทุก 100ms (เพื่อความแม่นยำ)
    updateCountdown();
    const timerRef = setInterval(updateCountdown, 100);

    // ⭐ Sync เวลาเมื่อ tab กลับมา active
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isComponentMounted) {
        console.log("🔄 Card countdown synced after tab became visible");
        updateCountdown(); // ⭐ จะเรียก triggerFlipCard() ถ้าเวลาหมดแล้ว
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isComponentMounted = false;
      clearInterval(timerRef);
      if (flipTimeoutId) clearTimeout(flipTimeoutId); // ⭐ Clear timeout
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    isCardFlipped,
    onFlipCard,
    keySessionStartCountdown,
    keySessionEndCountdown,
  ]);

  // -----------------------------------------------------
  // PROGRESS BAR (แก้บัคเริ่มที่ 100%)
  // -----------------------------------------------------
  const countdownProgressMemo = useMemo(() => {
    const progress = Math.max(
      0,
      Math.min(100, ((DELAY - countdown) / DELAY) * 100)
    );

    return (
      <div className="mt-8 w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  }, [countdown]);

  // -----------------------------------------------------
  // UI
  // -----------------------------------------------------
  return (
    <div className="perspective-1000">
      <div
        className={`relative w-full max-w-md mx-auto transition-transform duration-700 transform-style-3d ${
          isCardFlipped ? "rotate-y-180" : ""
        }`}
        style={{
          transformStyle: "preserve-3d",
          minHeight: isCardFlipped ? "auto" : "400px",
        }}
      >
        {/* Back Side */}
        <div
          className={`absolute inset-0 backface-hidden ${
            isCardFlipped ? "pointer-events-none" : ""
          }`}
        >
          <Card
            className="bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-gray-600 cursor-pointer hover:border-blue-500 transition-all duration-300 hover:scale-105"
            onClick={onFlipCard}
          >
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 animate-pulse">
                <i className="pi pi-question text-white text-6xl" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">???</h2>
              <p className="text-gray-400 text-center">คลิกเพื่อเปิดการ์ด</p>
            </div>

            {countdownProgressMemo}
          </Card>
        </div>

        {/* Front Side */}
        <div
          className={`backface-hidden rotate-y-180 ${
            isCardFlipped ? "relative" : "absolute inset-0"
          }`}
          style={{ transform: "rotateY(180deg)" }}
        >
          {my && (
            <Card
              className={`bg-gradient-to-br ${
                getRoleDisplay(my.role).bgColor
              } border-2 border-opacity-50`}
            >
              <div className="flex flex-col items-center justify-center py-8">
                {/* Role Icon */}
                <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-6">
                  <i
                    className={`pi ${
                      getRoleDisplay(my.role).icon
                    } text-white text-5xl`}
                  />
                </div>

                {/* Role Name */}
                <h2 className="text-4xl font-bold text-white mb-6">
                  {getRoleDisplay(my.role).name}
                </h2>

                <div className="w-full space-y-4">
                  {/* CITIZEN */}
                  {my.role === RoleGame.CITIZEN && (
                    <>
                      <i className="pi pi-question-circle text-white text-3xl mb-3" />
                      <p className="text-white text-lg">คุณไม่ทราบคำตอบ</p>
                      <p className="text-gray-200 text-sm mt-2">
                        ถามคำถามเพื่อหาคำตอบ
                      </p>
                    </>
                  )}

                  {/* MASTER */}
                  {my.role === RoleGame.MASTER && (
                    <div className="space-y-3">
                      <div className="bg-gray-700 bg-opacity-70 rounded-lg p-3 border border-gray-600">
                        <p className="text-gray-300 text-xs mb-1">คำตอบ:</p>
                        <p className="text-white text-2xl font-bold">
                          {my.answer}
                        </p>
                      </div>

                      <div className="bg-yellow-500 bg-opacity-20 rounded-lg p-4">
                        <p className="text-yellow-200 text-sm">
                          <i className="pi pi-info-circle mr-2" />
                          คุณต้องให้คำใบ้ผู้เล่นแต่ไม่ให้รู้คำตอบ
                        </p>
                      </div>
                    </div>
                  )}

                  {/* INSIDER */}
                  {my.role === RoleGame.INSIDER && (
                    <div className="space-y-3">
                      <div className="bg-gray-700 bg-opacity-70 rounded-lg p-3 border border-gray-600">
                        <p className="text-gray-300 text-xs mb-1">คำตอบ:</p>
                        <p className="text-white text-2xl font-bold">
                          {my.answer}
                        </p>
                      </div>

                      <div className="bg-red-500 bg-opacity-20 rounded-lg p-4">
                        <p className="text-red-200 text-sm">
                          <i className="pi pi-eye mr-2" />
                          คุณต้องบงการผู้เล่นให้ไปสู่คำตอบ แต่อย่าให้ถูกจับได้!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
