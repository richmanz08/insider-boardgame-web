"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { CountdownPlayModal } from "./CountdownPlay";
import { EditRoomModal, EditRoomFormData } from "./EditRoom";
import { PlayContainer } from "../play/Play";
import { set } from "react-hook-form";

interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isReady: boolean;
}

interface RoomContainerProps {
  roomId?: string;
}

type RoomStatus = "waiting" | "ready" | "playing" | "finished";

export const RoomContainer: React.FC<RoomContainerProps> = ({ roomId }) => {
  // Mock data - ในอนาคตจะดึงจาก API/WebSocket
  console.log("Room ID:", roomId); // TODO: ใช้ดึงข้อมูลห้องจาก API
  const router = useRouter();
  const [roomName, setRoomName] = useState("ห้องของนักสืบ");
  const [roomStatus, setRoomStatus] = useState<RoomStatus>("waiting");
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [hasPassword, setHasPassword] = useState(false);
  const [currentUserId] = useState("2"); // Mock current user ID
  const [showEditModal, setShowEditModal] = useState(false);

  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "PlayerOne", isHost: false, isReady: true },
    { id: "2", name: "You", isHost: true, isReady: false },
    { id: "3", name: "GameMaster", isHost: false, isReady: true },
    { id: "4", name: "Newbie", isHost: false, isReady: true },
  ]);

  const [showCountdown, setShowCountdown] = useState(false);

  const currentPlayer = players.find((p) => p.id === currentUserId);
  const allPlayersReady = players.every((p) => p.isReady);
  const isHost = currentPlayer?.isHost || false;

  // แสดง countdown อัตโนมัติเมื่อทุกคนพร้อมและเป็น host
  useEffect(() => {
    console.log("Check countdown conditions:", {
      allPlayersReady,
      isHost,
      roomStatus,
      showCountdown,
    });

    if (
      allPlayersReady &&
      isHost &&
      roomStatus === "waiting" &&
      !showCountdown
    ) {
      console.log("Starting countdown timer...");
      // รอ 1 วินาทีก่อนแสดง countdown เพื่อให้ player เห็นว่าทุกคนพร้อมแล้ว
      const timer = setTimeout(() => {
        console.log("Setting showCountdown to true");
        setShowCountdown(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [allPlayersReady, isHost, roomStatus, showCountdown]);

  const handleToggleReady = () => {
    setPlayers(
      players.map((p) =>
        p.id === currentUserId ? { ...p, isReady: !p.isReady } : p
      )
    );
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setRoomStatus("playing");
    console.log("Game started!");
    // TODO: เรียก API เริ่มเกม และ navigate ไปหน้าเกม
  };

  const handleEditRoom = (data: EditRoomFormData) => {
    console.log("Edit room data:", data);

    // อัพเดทข้อมูลห้อง
    setRoomName(data.roomName);
    setMaxPlayers(data.maxPlayers);

    // จัดการพาสเวิร์ด
    if (data.removePassword) {
      setHasPassword(false);
      console.log("Password removed");
      // TODO: เรียก API ลบพาสเวิร์ด
    } else if (data.password && data.password.length > 0) {
      setHasPassword(true);
      console.log("Password updated/set");
      // TODO: เรียก API อัพเดทพาสเวิร์ด
    }

    // TODO: เรียก API อัพเดทข้อมูลห้อง
  };

  const getStatusLabel = (status: RoomStatus) => {
    switch (status) {
      case "waiting":
        return "รอผู้เล่น";
      case "ready":
        return "พร้อมเริ่ม";
      case "playing":
        return "กำลังเล่น";
      case "finished":
        return "จบเกม";
      default:
        return status;
    }
  };

  const getStatusSeverity = (status: RoomStatus) => {
    switch (status) {
      case "waiting":
        return "info";
      case "ready":
        return "success";
      case "playing":
        return "warning";
      case "finished":
        return "secondary";
      default:
        return "info";
    }
  };

  const renderPlayerCard = (player: Player) => {
    return (
      <Card key={player.id} className="relative overflow-hidden">
        {/* Host Badge */}
        {player.isHost && (
          <div className="absolute top-2 right-2">
            <Tag
              icon="pi pi-crown"
              severity="warning"
              value="หัวห้อง"
              className="text-xs"
            />
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {player.name.charAt(0).toUpperCase()}
            </div>
            {/* Ready Indicator */}
            {player.isReady && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <i className="pi pi-check text-white text-xs" />
              </div>
            )}
          </div>

          {/* Player Info */}
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">{player.name}</h3>
            <div className="flex items-center gap-2">
              {player.isReady ? (
                <span className="text-green-500 text-sm flex items-center gap-1">
                  <i className="pi pi-check-circle" />
                  พร้อม
                </span>
              ) : (
                <span className="text-gray-400 text-sm flex items-center gap-1">
                  <i className="pi pi-clock" />
                  รอ...
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const onResetRoom = () => {
    // รีเซ็ตสถานะห้องและผู้เล่น
    setRoomStatus("waiting");
    setPlayers(
      players.map((p) => ({
        ...p,
        isReady: false,
      }))
    );
  };

  const onExitRoom = () => {
    console.log("Leave room");
    router.push("/room/list");
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Room Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{roomName}</h1>
              {hasPassword && (
                <i
                  className="pi pi-lock text-yellow-400"
                  title="ห้องมีพาสเวิร์ด"
                />
              )}
            </div>
            <div className="flex items-center gap-3">
              <Tag
                value={getStatusLabel(roomStatus)}
                severity={getStatusSeverity(roomStatus)}
                icon="pi pi-info-circle"
              />
              <span className="text-gray-400">
                <i className="pi pi-users mr-2" />
                {players.length}/{maxPlayers} ผู้เล่น
              </span>
              {allPlayersReady && roomStatus === "ready" && (
                <Tag
                  value="ทุกคนพร้อมแล้ว!"
                  severity="success"
                  icon="pi pi-check-circle"
                />
              )}
            </div>
          </div>

          {roomStatus !== "playing" && (
            <div className="flex gap-2">
              {/* ปุ่มแก้ไขห้อง - แสดงเฉพาะหัวห้อง */}
              {isHost && (
                <Button
                  label="แก้ไขห้อง"
                  icon="pi pi-cog"
                  severity="secondary"
                  outlined
                  onClick={() => setShowEditModal(true)}
                />
              )}
              <Button
                label="ออกจากห้อง"
                icon="pi pi-sign-out"
                severity="danger"
                outlined
                onClick={() => onExitRoom()}
              />
            </div>
          )}
        </div>

        {/* Progress Info */}
        {roomStatus === "waiting" && (
          <Card className="bg-blue-900/20 border-blue-500/30">
            <div className="flex items-center gap-3">
              <i className="pi pi-info-circle text-blue-400 text-xl" />
              <div>
                <p className="font-semibold mb-1">รอผู้เล่นพร้อม</p>
                <p className="text-sm text-gray-400">
                  ทุกคนต้องกดปุ่ม &quot;พร้อม&quot; ก่อนเริ่มเกม
                  (ต้องมีอย่างน้อย 4 คน)
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {roomStatus === "playing" ? (
        <PlayContainer
          roomId={roomId || "1"}
          onPlayEnd={function () {
            onResetRoom();
          }}
        />
      ) : (
        <>
          {/* Players Grid */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">ผู้เล่นในห้อง</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map(renderPlayerCard)}

              {/* Empty Slots */}
              {Array.from({ length: maxPlayers - players.length }).map(
                (_, index) => (
                  <Card
                    key={`empty-${index}`}
                    className="opacity-50 border-dashed"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-gray-500">
                        <i className="pi pi-user text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-500">
                          รอผู้เล่น...
                        </h3>
                        <p className="text-sm text-gray-600">ช่องว่าง</p>
                      </div>
                    </div>
                  </Card>
                )
              )}
            </div>
          </div>

          {/* Action Buttons - Fixed at Bottom */}
          <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-gray-800 p-4 z-30">
            <div className="container mx-auto max-w-6xl flex gap-4 justify-center">
              <Button
                label={currentPlayer?.isReady ? "ยกเลิกพร้อม" : "พร้อม"}
                icon={currentPlayer?.isReady ? "pi pi-times" : "pi pi-check"}
                severity={currentPlayer?.isReady ? "secondary" : "success"}
                size="large"
                onClick={handleToggleReady}
                className="w-full md:w-auto min-w-[200px]"
              />
            </div>
          </div>

          {/* Spacer for fixed button */}
          <div className="h-24" />

          {/* Host Info */}
          {isHost && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">
                <i className="pi pi-crown mr-1" />
                คุณเป็นหัวห้อง เกมจะเริ่มอัตโนมัติเมื่อทุกคนพร้อม
              </p>
              {!allPlayersReady && (
                <p className="text-sm text-yellow-500 mt-2">
                  <i className="pi pi-exclamation-triangle mr-1" />
                  รอผู้เล่น {players.filter((p) => !p.isReady).length} คนกดพร้อม
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* Countdown Modal */}
      <CountdownPlayModal
        open={showCountdown}
        onCountdownComplete={handleCountdownComplete}
      />

      {/* Edit Room Modal - แสดงเฉพาะหัวห้อง */}
      <EditRoomModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEditRoom={handleEditRoom}
        currentRoomData={{
          roomName,
          maxPlayers,
          hasPassword,
        }}
      />
    </div>
  );
};
