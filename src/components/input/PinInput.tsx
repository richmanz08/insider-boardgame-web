"use client";
import React, { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";

interface PinInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  onErrorChange?: (error: boolean) => void;
}

export const PinInput: React.FC<PinInputProps> = ({
  length = 4,
  value,
  onChange,
  error = false,
  disabled = false,
  className = "",
  onErrorChange,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // สร้าง array ของค่าแต่ละช่อง
  const values = value.split("").slice(0, length);
  while (values.length < length) {
    values.push("");
  }

  const handleChange = (index: number, inputValue: string) => {
    // รับเฉพาะตัวเลข
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    if (numericValue.length === 0) {
      // ลบค่าในช่องปัจจุบัน
      const newValues = [...values];
      newValues[index] = "";
      const newPin = newValues.join("");
      onChange(newPin);

      // เรียก onErrorChange ถ้ามี
      if (onErrorChange) {
        onErrorChange(newPin.length > 0 && newPin.length < length);
      }
      return;
    }

    if (numericValue.length === 1) {
      // กรอกค่าในช่องปัจจุบัน
      const newValues = [...values];
      newValues[index] = numericValue;
      const newPin = newValues.join("");
      onChange(newPin);

      // เรียก onErrorChange ถ้ามี
      if (onErrorChange) {
        onErrorChange(newPin.length > 0 && newPin.length < length);
      }

      // ย้ายไปช่องถัดไป
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (numericValue.length > 1) {
      // กรณี paste หรือกรอกหลายตัวพร้อมกัน
      const newValues = [...values];
      for (let i = 0; i < numericValue.length && index + i < length; i++) {
        newValues[index + i] = numericValue[i];
      }
      const newPin = newValues.join("");
      onChange(newPin);

      // เรียก onErrorChange ถ้ามี
      if (onErrorChange) {
        onErrorChange(newPin.length > 0 && newPin.length < length);
      }

      // ย้าย focus ไปช่องสุดท้ายที่มีค่า หรือช่องถัดไป
      const nextIndex = Math.min(index + numericValue.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (values[index] === "") {
        // ถ้าช่องปัจจุบันว่าง ย้ายไปช่องก่อนหน้า
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        // ลบค่าในช่องปัจจุบัน
        const newValues = [...values];
        newValues[index] = "";
        const newPin = newValues.join("");
        onChange(newPin);

        // เรียก onErrorChange ถ้ามี
        if (onErrorChange) {
          onErrorChange(newPin.length > 0 && newPin.length < length);
        }
      }
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      e.preventDefault();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const numericData = pastedData.replace(/[^0-9]/g, "").slice(0, length);

    if (numericData) {
      onChange(numericData);

      // เรียก onErrorChange ถ้ามี
      if (onErrorChange) {
        onErrorChange(numericData.length > 0 && numericData.length < length);
      }

      // ย้าย focus ไปช่องสุดท้าย
      const lastIndex = Math.min(numericData.length - 1, length - 1);
      setTimeout(() => {
        inputRefs.current[lastIndex]?.focus();
      }, 0);
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
    // Select all text เมื่อ focus
    inputRefs.current[index]?.select();
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  return (
    <div className={`flex gap-3 justify-center ${className}`}>
      {values.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          onBlur={handleBlur}
          disabled={disabled}
          className={`
            w-14 h-16 text-center text-2xl font-semibold
            rounded-lg border-2 
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : focusedIndex === index
                ? "border-purple-500 focus:border-purple-500 focus:ring-purple-500"
                : digit
                ? "border-purple-400 bg-purple-50/5"
                : "border-gray-600 hover:border-gray-500"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"}
            bg-[#1e1e1e]
          `}
          aria-label={`PIN digit ${index + 1}`}
        />
      ))}
    </div>
  );
};
