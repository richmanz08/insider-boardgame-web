"use client";
import React, { useState, useEffect, useRef } from "react";

interface CountdownPlayModalProps {
  open: boolean;
  onCountdownComplete?: () => void;
}

export const CountdownPlayModal: React.FC<CountdownPlayModalProps> = ({
  open,
  onCountdownComplete,
}) => {
  const COUNTDOWN_DURATION = 5; // วินาที
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION);
  const [progress, setProgress] = useState(0); // เพิ่ม state สำหรับ progress bar
  const endTimeRef = useRef<number | null>(null);
  const hasCompletedRef = useRef(false);

  // ⭐ ตั้งเวลาสิ้นสุดเมื่อ modal เปิด
  useEffect(() => {
    if (open) {
      endTimeRef.current = Date.now() + COUNTDOWN_DURATION * 1000;
      hasCompletedRef.current = false;
      queueMicrotask(() => {
        setCountdown(COUNTDOWN_DURATION);
        setProgress(0);
      });
    } else {
      endTimeRef.current = null;
    }
  }, [open]);

  // ⭐ คำนวณเวลาจาก timestamp แทน setTimeout
  useEffect(() => {
    if (!open || !endTimeRef.current) return;

    let isComponentMounted = true;

    const updateCountdown = () => {
      if (!isComponentMounted || !endTimeRef.current) return;

      const now = Date.now();
      const remainingMs = endTimeRef.current - now;
      const remaining = Math.max(0, Math.ceil(remainingMs / 1000));

      setCountdown(remaining);

      // คำนวณ progress แบบแม่นยำจาก milliseconds
      const totalMs = COUNTDOWN_DURATION * 1000;
      const progressPercent = Math.min(
        100,
        Math.max(0, ((totalMs - remainingMs) / totalMs) * 100)
      );
      setProgress(progressPercent);

      // ⭐ เมื่อหมดเวลา
      if (remaining <= 0 && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        setTimeout(() => {
          if (onCountdownComplete) {
            onCountdownComplete();
          }
        }, 500);
      }
    };

    // อัปเดททันทีและทุก 100ms (เพื่อความแม่นยำ)
    updateCountdown();
    const timerRef = setInterval(updateCountdown, 100);

    // ⭐ Sync เวลาเมื่อ tab กลับมา active
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isComponentMounted) {
        updateCountdown();
        console.log("🔄 Countdown synced after tab became visible");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isComponentMounted = false;
      clearInterval(timerRef);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [open, onCountdownComplete]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop - ไม่สามารถคลิกปิดได้ */}
      <div className="fixed inset-0 bg-black/90 z-[100]" />
      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div
          className="rounded-2xl shadow-2xl p-12 text-center max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="mb-6 flex items-center justify-center">
            <div className="bg-indigo-400 rounded-full h-[56px] w-[56px] flex items-center justify-center">
              <i className="pi pi-clock !text-3xl text-white-400" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold mb-4 text-white">
            เกมกำลังจะเริ่ม!
          </h2>

          {/* Countdown Number */}
          <div className="my-8">
            <div className="text-9xl font-bold text-indigo-500 animate-pulse">
              {countdown}
            </div>
          </div>

          {/* Message */}
          <p className="text-xl text-gray-200">เตรียมตัวให้พร้อม...</p>

          {/* Loading Bar */}
          <div className="mt-8 w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
