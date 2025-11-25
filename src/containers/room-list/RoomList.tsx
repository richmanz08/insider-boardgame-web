"use client";
import React, { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { Password } from "primereact/password";
import { CreateRoomContainer } from "./CreateRoom";
import { useRouter } from "next/navigation";

interface Room {
  id: string;
  name: string;
  currentPlayers: number;
  maxPlayers: number;
  status: "waiting" | "playing" | "finished";
  hasPassword: boolean;
  hostName: string;
}

interface CreateRoomFormData {
  roomName: string;
  maxPlayers: number;
  password?: string;
}

export const RoomListContainer: React.FC = () => {
  const router = useRouter();
  // Mock data - ในอนาคตจะดึงจาก API
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      name: "ห้องของนักสืบ",
      currentPlayers: 3,
      maxPlayers: 8,
      status: "waiting",
      hasPassword: false,
      hostName: "PlayerOne",
    },
    {
      id: "2",
      name: "Insider Masters",
      currentPlayers: 5,
      maxPlayers: 6,
      status: "playing",
      hasPassword: true,
      hostName: "GameMaster",
    },
    {
      id: "3",
      name: "Beginner's Room",
      currentPlayers: 2,
      maxPlayers: 5,
      status: "waiting",
      hasPassword: false,
      hostName: "Newbie",
    },
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [roomPassword, setRoomPassword] = useState("");

  const getStatusSeverity = (status: Room["status"]) => {
    switch (status) {
      case "waiting":
        return "success";
      case "playing":
        return "warning";
      case "finished":
        return "info";
      default:
        return "info";
    }
  };

  const getStatusLabel = (status: Room["status"]) => {
    switch (status) {
      case "waiting":
        return "รอผู้เล่น";
      case "playing":
        return "กำลังเล่น";
      case "finished":
        return "จบเกม";
      default:
        return status;
    }
  };

  const handleCreateRoom = (data: CreateRoomFormData) => {
    console.log("Creating room:", data);
    // TODO: เรียก API สร้างห้อง
    const newRoom: Room = {
      id: String(rooms.length + 1),
      name: data.roomName,
      currentPlayers: 1,
      maxPlayers: data.maxPlayers,
      status: "waiting",
      hasPassword: !!data.password,
      hostName: "You", // จะเอาจาก user context
    };
    setRooms([...rooms, newRoom]);
  };

  const handleJoinRoom = (room: Room) => {
    if (room.hasPassword) {
      setSelectedRoom(room);
      setShowPasswordDialog(true);
    } else {
      joinRoom(room.id);
    }
  };

  const handlePasswordSubmit = () => {
    if (selectedRoom && roomPassword) {
      // TODO: ตรวจสอบ password กับ API
      console.log("Joining room with password:", selectedRoom.id, roomPassword);
      joinRoom(selectedRoom.id);
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

  const renderRoomCard = (room: Room) => {
    const isJoinable =
      room.status === "waiting" && room.currentPlayers < room.maxPlayers;

    return (
      <Card key={room.id} className="mb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold">{room.name}</h3>
              {room.hasPassword && <i className="pi pi-lock text-yellow-500" />}
            </div>

            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-2">
                <i className="pi pi-users" />
                <span>
                  {room.currentPlayers}/{room.maxPlayers} ผู้เล่น
                </span>
              </div>

              <Tag
                value={getStatusLabel(room.status)}
                severity={getStatusSeverity(room.status)}
              />
            </div>

            <p className="text-sm text-gray-400">
              <i className="pi pi-user mr-1" />
              Host: {room.hostName}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {isJoinable ? (
              <Button
                label="เข้าร่วม"
                icon="pi pi-sign-in"
                onClick={() => handleJoinRoom(room)}
                severity="success"
              />
            ) : (
              <Button
                label={room.status === "playing" ? "กำลังเล่น" : "เต็ม"}
                disabled
                severity="secondary"
              />
            )}
          </div>
        </div>
      </Card>
    );
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
        <span>พบ {rooms.length} ห้อง</span>
      </div>

      {rooms.length === 0 ? (
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
        <div>{rooms.map(renderRoomCard)}</div>
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
            ห้อง &quot;{selectedRoom?.name}&quot; ต้องการรหัสผ่านในการเข้าร่วม
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
