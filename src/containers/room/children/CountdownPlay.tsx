"use client";
import React, { useState, useEffect } from "react";

interface CountdownPlayModalProps {
  open: boolean;
  onCountdownComplete?: () => void;
}

export const CountdownPlayModal: React.FC<CountdownPlayModalProps> = ({
  open,
  onCountdownComplete,
}) => {
  const [countdown, setCountdown] = useState(5);
  const [isFirstRender, setIsFirstRender] = useState(true);

  // Reset countdown เมื่อ modal เปิดใหม่
  useEffect(() => {
    if (open && !isFirstRender) {
      queueMicrotask(() => setCountdown(5));
    }
    if (open) {
      queueMicrotask(() => setIsFirstRender(false));
    }
  }, [open, isFirstRender]);

  // นับถอยหลัง
  useEffect(() => {
    if (!open) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      const completeTimer = setTimeout(() => {
        if (onCountdownComplete) {
          onCountdownComplete();
        }
      }, 500);

      return () => clearTimeout(completeTimer);
    }
  }, [countdown, open, onCountdownComplete]);

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
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-1000 ease-linear"
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
