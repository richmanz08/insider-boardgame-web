"use client";
import React, { useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { useForm, Controller } from "react-hook-form";
import { useAppSelector } from "@/src/redux/hook";
import { RootState } from "@/src/redux/store";
import { createRoomService } from "@/app/api/room/RoomService";
import { RoomData } from "@/app/api/room/RoomInterface";
import { Button } from "@/src/components/button/Button";
import { PinInput } from "@/src/components/input/PinInput";
import { trim } from "lodash";

interface CreateRoomProps {
  open: boolean;
  onClose: () => void;
  onCreateRoom?: (data: RoomData, password?: string) => void;
}

interface CreateRoomFormData {
  roomName: string;
  maxPlayers: number;
  password?: string;
}

export const CreateRoomContainer: React.FC<CreateRoomProps> = ({
  open,
  onClose,
  onCreateRoom,
}) => {
  const me = useAppSelector((state: RootState) => state.me.me);
  const [isClosing, setIsClosing] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<CreateRoomFormData>({
    defaultValues: {
      roomName: "",
      maxPlayers: 8,
      password: "",
    },
    mode: "onChange",
  });

  const handleFormSubmit = async (data: CreateRoomFormData) => {
    if (!me) return;
    try {
      const res = await createRoomService({
        roomName: trim(data.roomName),
        maxPlayers: data.maxPlayers,
        hostUuid: me.uuid || "",
        hostName: me.playerName || "",
        password: data.password,
      });
      if (res && onCreateRoom) {
        onCreateRoom(res.data, data.password);
      }
    } catch (error) {
      console.log("Error creating room:", error);
    }

    // รีเซ็ตฟอร์มและปิด modal
    reset();
    handleClose();
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleDialogHide = () => {
    reset();
    handleClose();
  };

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

  if (!open && !isClosing) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 ${
          isClosing ? "animate-fade-out" : "animate-fade-in"
        }`}
        onClick={handleDialogHide}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`bg-[#1e1e1e] rounded-lg shadow-xl w-full max-w-md border border-gray-700 ${
            isClosing ? "animate-scale-down" : "animate-scale-up"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold">สร้างห้องใหม่</h2>
            <button
              onClick={handleDialogHide}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <i className="pi pi-times text-xl" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4 p-6">
            {/* ชื่อห้อง */}
            <div className="flex flex-col gap-2">
              <label htmlFor="roomName" className="font-semibold">
                ชื่อห้อง <span className="text-red-500">*</span>
              </label>
              <InputText
                id="roomName"
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
                  validate: (value) => {
                    if (value.trim().length < 3) {
                      return "ชื่อห้องต้องมีตัวอักษร ไม่ใช่แค่ช่องว่าง, และต้องมีอย่างน้อย 3 ตัวอักษร";
                    }
                    return true;
                  },
                })}
                placeholder="กรอกชื่อห้อง"
                className={errors.roomName ? "p-invalid w-full" : "w-full"}
              />
              {errors.roomName && (
                <small className="text-red-500">
                  {errors.roomName.message}
                </small>
              )}
            </div>

            {/* จำนวนผู้เล่น */}
            <div className="flex flex-col gap-2">
              <label htmlFor="maxPlayers" className="font-semibold">
                จำนวนผู้เล่นสูงสุด <span className="text-red-500">*</span>
              </label>
              <InputText
                id="maxPlayers"
                type="number"
                max={10}
                {...register("maxPlayers", {
                  required: "กรุณากรอกจำนวนผู้เล่น",
                  min: {
                    value: 5,
                    message: "ต้องมีผู้เล่นอย่างน้อย 5 คน",
                  },
                  max: {
                    value: 10,
                    message: "ผู้เล่นสูงสุด 10 คน",
                  },
                  valueAsNumber: true,
                })}
                className={errors.maxPlayers ? "p-invalid w-full" : "w-full"}
              />
              {errors.maxPlayers && (
                <small className="text-red-500">
                  {errors.maxPlayers.message}
                </small>
              )}
              <small className="text-gray-400">
                ระบุจำนวนผู้เล่นระหว่าง 4-10 คน
              </small>
            </div>

            {/* รหัสผ่าน (ไม่บังคับ) */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="font-semibold">
                รหัสผ่าน <span className="text-gray-400">(ไม่จำเป็น)</span>
              </label>
              <Controller
                name="password"
                control={control}
                rules={{
                  minLength: {
                    value: 4,
                    message: "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร",
                  },
                }}
                render={({ field }) => (
                  <PinInput
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    // onErrorChange={(field.onChange)}
                  />
                )}
              />
              {/* {errors.password && (
                <small className="text-red-500">
                  {errors.password.message}
                </small>
              )} */}
              <small className="text-gray-400">
                ตั้งรหัสผ่านถ้าต้องการให้เฉพาะผู้ที่รู้รหัสเท่านั้นเข้าห้องได้
              </small>
            </div>

            {/* ปุ่ม */}
            <div className="flex gap-2 justify-end mt-4">
              <Button
                label="ยกเลิก"
                className="w-full"
                severity="secondary"
                outlined
                onClick={handleDialogHide}
              />
              <Button
                disabled={!isValid}
                label="สร้างห้อง"
                className="w-full"
                icon="pi pi-check"
                severity="indigo"
                onClick={function () {
                  handleSubmit(handleFormSubmit)();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
