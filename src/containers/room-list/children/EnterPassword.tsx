import { RoomData } from "@/app/api/room/RoomInterface";
import { Button } from "@/src/components/button/Button";
import { PinInput } from "@/src/components/input/PinInput";
import { useEffect, useRef, useState } from "react";

interface EnterPasswordProps {
  open: boolean;
  room: RoomData | null;
  onClose: () => void;
  joinRoom: (roomCode: string, password: string) => Promise<void>;
}
export const EnterPassword: React.FC<EnterPasswordProps> = ({
  open,
  onClose,
  room,
  joinRoom,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [roomPassword, setRoomPassword] = useState("");
  const pinInputRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsClosing(true);
    setRoomPassword("");
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleDialogHide = () => {
    handleClose();
  };

  const handlePasswordSubmit = async () => {
    if (room && roomPassword && roomPassword.length === 4) {
      console.log("Joining room with password:", room.roomCode, roomPassword);
      await joinRoom(room.roomCode, roomPassword);
      handleClose();
    }
  };

  // Auto-focus ช่องแรกเมื่อเปิด modal
  useEffect(() => {
    if (open && pinInputRef.current) {
      setTimeout(() => {
        const firstInput = pinInputRef.current?.querySelector("input");
        firstInput?.focus();
      }, 100);
    }
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
            <h2 className="text-xl font-bold">กรุณากรอกรหัสผ่าน</h2>
            <button
              onClick={handleDialogHide}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <i className="pi pi-times text-xl" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6 p-6">
            <p className="text-gray-400 text-center">
              ห้อง &quot;{room?.roomName}&quot; ต้องการรหัสผ่านในการเข้าร่วม
            </p>

            <div className="flex flex-col gap-3" ref={pinInputRef}>
              <label
                htmlFor="roomPassword"
                className="font-semibold text-center"
              >
                รหัสผ่าน (4 หลัก)
              </label>
              <PinInput
                length={4}
                value={roomPassword}
                onChange={setRoomPassword}
              />
            </div>

            <div className="flex gap-2 justify-end mt-4">
              <Button
                label="ยกเลิก"
                className="w-full"
                severity="secondary"
                outlined
                onClick={handleClose}
              />
              <Button
                disabled={roomPassword.length !== 4}
                label="เข้าร่วม"
                icon="pi pi-sign-in"
                className="w-full"
                severity="indigo"
                onClick={handlePasswordSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
