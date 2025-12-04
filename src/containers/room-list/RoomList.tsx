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
import { EnterPassword } from "./children/EnterPassword";

export const RoomListContainer: React.FC = () => {
  const router = useRouter();
  const me = useSelector((state: RootState) => state.me.me);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [enterPasswordDialog, setEnterPasswordDialog] =
    useState<RoomData | null>(null);

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
      setEnterPasswordDialog(room);
    } else {
      joinRoom(room.roomCode, undefined);
    }
  };

  const joinRoom = async (roomCode: string, password?: string) => {
    if (!me) {
      console.error("User not authenticated");
      return;
    }

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
        setEnterPasswordDialog(null);
      }
    } catch (error) {
      console.error("Error joining room:", error);
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
      <EnterPassword
        open={!!enterPasswordDialog}
        room={enterPasswordDialog}
        onClose={() => setEnterPasswordDialog(null)}
        joinRoom={joinRoom}
      />
    </div>
  );
};
