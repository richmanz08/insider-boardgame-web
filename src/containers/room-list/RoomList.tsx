"use client";
import React, { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Password } from "primereact/password";
import { CreateRoomContainer } from "./children/CreateRoomModal";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  getRoomListService,
  joinRoomService,
} from "@/app/api/room/RoomService";
import { RoomData } from "@/app/api/room/RoomInterface";
import { map } from "lodash";
import { RoomCard } from "@/src/components/card/RoomCard";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { HeaderListRoom } from "./children/HeaderListRoom";

export const RoomListContainer: React.FC = () => {
  const router = useRouter();
  const me = useSelector((state: RootState) => state.me.me);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [roomPassword, setRoomPassword] = useState("");

  const { data, refetch, isRefetching } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const response = await getRoomListService();
      return response;
    },
    refetchOnWindowFocus: "always",
  });
  console.log("Fetched rooms data:", data);

  const handleRefresh = () => {
    refetch();
  };

  const handleCreateRoom = async (data: RoomData) => {
    console.log("Room created:", data);
    router.push(`/room/${data.roomCode}`);
    // เมื่อสร้างห้องสำเร็จ host ควรเข้าห้องอัตโนมัติ
  };

  const handleJoinRoom = (room: RoomData) => {
    if (room.hasPassword) {
      setSelectedRoom(room);
      setShowPasswordDialog(true);
    } else {
      joinRoom(room.roomCode, undefined);
    }
  };

  const handlePasswordSubmit = async () => {
    if (selectedRoom && roomPassword) {
      console.log(
        "Joining room with password:",
        selectedRoom.roomCode,
        roomPassword
      );
      await joinRoom(selectedRoom.roomCode, roomPassword);
      setShowPasswordDialog(false);
      setRoomPassword("");
      setSelectedRoom(null);
    }
  };

  const joinRoom = async (roomCode: string, password?: string) => {
    if (!me) {
      console.error("User not authenticated");
      return;
    }

    console.log("Calling joinRoomService:", {
      roomCode,
      playerUuid: me.uuid,
      playerName: me.playerName,
      hasPassword: !!password,
    });

    try {
      const response = await joinRoomService({
        roomCode,
        playerUuid: me.uuid,
        playerName: me.playerName,
        password,
      });

      if (response?.success) {
        console.log("Successfully joined room:", response.data);
        // Navigate to room page
        router.push(`/room/${roomCode}`);
      } else {
        console.error("Failed to join room:", response?.message);
        alert(response?.message || "ไม่สามารถเข้าร่วมห้องได้");
      }
    } catch (error) {
      console.error("Error joining room:", error);
      alert("เกิดข้อผิดพลาดในการเข้าร่วมห้อง");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <HeaderListRoom
        onRefresh={handleRefresh}
        isRefetching={isRefetching}
        onCreateRoom={() => setShowCreateDialog(true)}
        length={data?.data.length || 0}
      />

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
