"use client";
import React, { useState, useEffect } from "react";

interface CountdownPlayModalProps {
  open: boolean;
  onCountdownComplete?: () => void;
}

const CountdownContent: React.FC<{
  onCountdownComplete?: () => void;
}> = ({ onCountdownComplete }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // เมื่อนับถอยหลังเสร็จ
      const completeTimer = setTimeout(() => {
        if (onCountdownComplete) {
          onCountdownComplete();
        }
      }, 500);

      return () => clearTimeout(completeTimer);
    }
  }, [countdown, onCountdownComplete]);

  return (
    <>
      {/* Backdrop - ไม่สามารถคลิกปิดได้ */}
      <div className="fixed inset-0 bg-black/90 z-[100]" />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div
          className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl shadow-2xl p-12 text-center max-w-md w-full border-4 border-yellow-400"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="mb-6">
            <div className="inline-block p-4 bg-yellow-400 rounded-full">
              <i className="pi pi-clock text-6xl text-purple-900" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold mb-4 text-white">
            เกมกำลังจะเริ่ม!
          </h2>

          {/* Countdown Number */}
          <div className="my-8">
            <div className="text-9xl font-bold text-yellow-400 animate-pulse">
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

export const CountdownPlayModal: React.FC<CountdownPlayModalProps> = ({
  open,
  onCountdownComplete,
}) => {
  console.log("CountdownPlayModal - open:", open);

  if (!open) return null;

  // ใช้ open เป็น key เพื่อ remount component เมื่อเปิด modal ใหม่
  // จะทำให้ countdown รีเซ็ตเป็น 5 อัตโนมัติ
  return <CountdownContent onCountdownComplete={onCountdownComplete} />;
};
