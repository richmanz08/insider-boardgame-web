"use client";
import React, { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Password } from "primereact/password";
import { CreateRoomContainer } from "./CreateRoom";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getRoomListService } from "@/app/api/room/RoomService";
import { RoomData } from "@/app/api/room/RoomInterface";
import { map } from "lodash";
import { RoomCard } from "@/src/components/card/RoomCard";

interface CreateRoomFormData {
  roomName: string;
  maxPlayers: number;
  password?: string;
}

export const RoomListContainer: React.FC = () => {
  const router = useRouter();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [roomPassword, setRoomPassword] = useState("");

  const { data } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const response = await getRoomListService();
      return response;
    },
  });
  console.log("Fetched rooms data:", data);

  const handleCreateRoom = (data: CreateRoomFormData) => {
    console.log("Room created:", data);
  };

  const handleJoinRoom = (room: RoomData) => {
    if (room.hasPassword) {
      setSelectedRoom(room);
      setShowPasswordDialog(true);
    } else {
      joinRoom(room.roomCode);
    }
  };

  const handlePasswordSubmit = () => {
    if (selectedRoom && roomPassword) {
      // TODO: ตรวจสอบ password กับ API
      console.log(
        "Joining room with password:",
        selectedRoom.roomCode,
        roomPassword
      );
      joinRoom(selectedRoom.roomCode);
      setShowPasswordDialog(false);
      setRoomPassword("");
      setSelectedRoom(null);
    }
  };

  const joinRoom = (roomId: string) => {
    console.log("Joining room:", roomId);
    // TODO: เรียก API เข้าร่วมห้อง และ navigate ไปหน้าห้อง
    router.push(`/room/${roomId}`);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">รายการห้อง</h1>
          <p className="text-gray-400">
            เลือกห้องเพื่อเข้าร่วมหรือสร้างห้องใหม่
          </p>
        </div>

        <Button
          label="สร้างห้อง"
          icon="pi pi-plus"
          onClick={() => setShowCreateDialog(true)}
          severity="info"
          size="large"
        />
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
        <i className="pi pi-info-circle" />
        <span>พบ {data?.data.length} ห้อง</span>
      </div>

      {data?.data.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <i className="pi pi-inbox text-4xl text-gray-400 mb-4" />
            <p className="text-gray-400">ยังไม่มีห้องในระบบ</p>
            <p className="text-sm text-gray-500 mt-2">
              คลิกปุ่ม &quot;สร้างห้อง&quot; เพื่อเริ่มเกมใหม่
            </p>
          </div>
        </Card>
      ) : (
        <div>
          {map(data?.data, (room) => (
            <RoomCard key={room.roomCode} room={room} onJoin={handleJoinRoom} />
          ))}
        </div>
      )}

      {/* Create Room Modal */}
      <CreateRoomContainer
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreateRoom={handleCreateRoom}
      />

      {/* Dialog กรอกรหัสผ่าน */}
      <Dialog
        header="กรอกรหัสผ่าน"
        visible={showPasswordDialog}
        style={{ width: "400px" }}
        onHide={() => {
          setShowPasswordDialog(false);
          setRoomPassword("");
          setSelectedRoom(null);
        }}
      >
        <div className="flex flex-col gap-4">
          <p className="text-gray-400">
            ห้อง &quot;{selectedRoom?.roomName}&quot;
            ต้องการรหัสผ่านในการเข้าร่วม
          </p>

          <div className="flex flex-col gap-2">
            <label htmlFor="roomPassword" className="font-semibold">
              รหัสผ่าน
            </label>
            <Password
              id="roomPassword"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              placeholder="กรอกรหัสผ่าน"
              toggleMask
              feedback={false}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              label="ยกเลิก"
              severity="secondary"
              outlined
              onClick={() => {
                setShowPasswordDialog(false);
                setRoomPassword("");
                setSelectedRoom(null);
              }}
            />
            <Button
              label="เข้าร่วม"
              icon="pi pi-sign-in"
              onClick={handlePasswordSubmit}
              disabled={!roomPassword}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};
