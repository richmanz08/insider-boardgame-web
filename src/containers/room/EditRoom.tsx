"use client";

import React from "react";
import { useForm } from "react-hook-form";

interface EditRoomModalProps {
  open: boolean;
  onClose: () => void;
  onEditRoom: (data: EditRoomFormData) => void;
  currentRoomData: {
    roomName: string;
    maxPlayers: number;
    hasPassword: boolean;
  };
}

export interface EditRoomFormData {
  roomName: string;
  maxPlayers: number;
  password?: string;
  removePassword?: boolean;
}

export const EditRoomModal: React.FC<EditRoomModalProps> = ({
  open,
  onClose,
  onEditRoom,
  currentRoomData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditRoomFormData>({
    defaultValues: {
      roomName: currentRoomData.roomName,
      maxPlayers: currentRoomData.maxPlayers,
      password: "",
      removePassword: false,
    },
  });

  const [removePassword, setRemovePassword] = React.useState(false);
  const [password, setPassword] = React.useState("");

  const onSubmit = (data: EditRoomFormData) => {
    onEditRoom(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset({
      roomName: currentRoomData.roomName,
      maxPlayers: currentRoomData.maxPlayers,
      password: "",
      removePassword: false,
    });
    setRemovePassword(false);
    setPassword("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative z-[101] w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-6 m-4">
        <h2 className="text-2xl font-bold mb-6 text-white">แก้ไขห้อง</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* ชื่อห้อง */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">
              ชื่อห้อง <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("roomName", {
                required: "กรุณากรอกชื่อห้อง",
                minLength: {
                  value: 3,
                  message: "ชื่อห้องต้องมีอย่างน้อย 3 ตัวอักษร",
                },
                maxLength: {
                  value: 30,
                  message: "ชื่อห้องต้องไม่เกิน 30 ตัวอักษร",
                },
              })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกชื่อห้อง"
            />
            {errors.roomName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.roomName.message}
              </p>
            )}
          </div>

          {/* จำนวนผู้เล่นสูงสุด */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">
              จำนวนผู้เล่นสูงสุด <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register("maxPlayers", {
                required: "กรุณากรอกจำนวนผู้เล่น",
                min: {
                  value: 4,
                  message: "ต้องมีอย่างน้อย 4 คน",
                },
                max: {
                  value: 10,
                  message: "ไม่เกิน 10 คน",
                },
              })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="4"
              max="10"
            />
            {errors.maxPlayers && (
              <p className="mt-1 text-sm text-red-500">
                {errors.maxPlayers.message}
              </p>
            )}
          </div>

          {/* แสดงสถานะปัจจุบันของพาสเวิร์ด */}
          {currentRoomData.hasPassword && (
            <div className="p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
              <p className="text-sm text-blue-300">
                <i className="pi pi-lock mr-2" />
                ห้องนี้มีการตั้งพาสเวิร์ดอยู่
              </p>
            </div>
          )}

          {/* ลบพาสเวิร์ด (แสดงเฉพาะเมื่อมีพาสเวิร์ดอยู่) */}
          {currentRoomData.hasPassword && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="removePassword"
                {...register("removePassword", {
                  onChange: (e) => setRemovePassword(e.target.checked),
                })}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="removePassword"
                className="ml-2 text-sm text-gray-200"
              >
                ลบพาสเวิร์ด
              </label>
            </div>
          )}

          {/* เปลี่ยนหรือตั้งพาสเวิร์ดใหม่ */}
          {!removePassword && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">
                {currentRoomData.hasPassword
                  ? "เปลี่ยนพาสเวิร์ด"
                  : "ตั้งพาสเวิร์ด"}{" "}
                <span className="text-gray-400">(ถ้าต้องการ)</span>
              </label>
              <input
                type="password"
                {...register("password", {
                  minLength: {
                    value: 4,
                    message: "พาสเวิร์ดต้องมีอย่างน้อย 4 ตัวอักษร",
                  },
                  maxLength: {
                    value: 20,
                    message: "พาสเวิร์ดต้องไม่เกิน 20 ตัวอักษร",
                  },
                  onChange: (e) => setPassword(e.target.value),
                })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  currentRoomData.hasPassword
                    ? "กรอกพาสเวิร์ดใหม่ (เว้นว่างถ้าไม่เปลี่ยน)"
                    : "กรอกพาสเวิร์ด (ถ้าต้องการ)"
                }
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
              {password && password.length > 0 && (
                <p className="mt-1 text-xs text-yellow-400">
                  <i className="pi pi-info-circle mr-1" />
                  {currentRoomData.hasPassword
                    ? "จะมีการเปลี่ยนพาสเวิร์ดใหม่"
                    : "จะมีการตั้งพาสเวิร์ดให้ห้อง"}
                </p>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
