/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { CountdownPlayModal } from "./CountdownPlay";
import { EditRoomModal, EditRoomFormData } from "./EditRoom";
import { PlayContainer } from "../play/Play";
import { leaveRoomService } from "@/app/api/room/RoomService";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RoomData, RoomStatus } from "@/app/api/room/RoomInterface";
import { useRoomWebSocket } from "@/src/hooks/useRoomWebSocket";
import { map } from "lodash";
import { PlayerCard } from "@/src/components/card/PlayerCard";
import { PlayerCardEmpty } from "@/src/components/card/PlayerCardEmpty";
import { useRoomHook } from "./hook";
import { MINIMUM_PLAYERS } from "@/src/config/system";
import { getActiveGameService } from "@/app/api/game/GameService";

interface RoomContainerProps {
  roomData: RoomData;
}

export const RoomContainer: React.FC<RoomContainerProps> = ({ roomData }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { checkShowModalCountdownStart, getStatusLabel, getStatusSeverity } =
    useRoomHook();
  const me = useSelector((state: RootState) => state.me.me);

  const {
    players,
    isConnected,
    lastUpdate,
    toggleReady,
    startGame,
    gamePrivateInfo,
  } = useRoomWebSocket(roomData.roomCode, me ? me.uuid : "");

  // const { data: gameData } = useQuery({
  //   queryKey: ["game", roomData.roomCode],
  //   queryFn: async () => {
  //     const gameRes = await getActiveGameService(roomData.roomCode);
  //     return gameRes;
  //   },
  // });

  console.log("WebSocket players data:", {
    players,
    isConnected,
    lastUpdate,
    gamePrivateInfo,
    // gameData,
  });

  const [roomName, setRoomName] = useState(roomData.roomName);
  const [roomStatus, setRoomStatus] = useState<RoomStatus>(roomData.status);
  const [maxPlayers, setMaxPlayers] = useState(roomData.maxPlayers);
  const [hasPassword, setHasPassword] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);

  const allPlayersReady = players.every((p) => p.ready);

  const currentPlayerMemorize = React.useMemo(() => {
    return players.find((p) => p.uuid === me?.uuid);
  }, [players, me]);

  const isHost = currentPlayerMemorize?.host || false;

  // Display countdown automatically when all players are ready and user is host
  useEffect(() => {
    const isReadyToStart = checkShowModalCountdownStart(players);
    if (isReadyToStart && !showCountdown) {
      const timer = setTimeout(() => {
        // setShowCountdown(true);
        if (isHost) startGame();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [players, startGame]);

  const handleCountdownComplete = () => {
    // setShowCountdown(false);
    // setRoomStatus(RoomStatus.PLAYING);
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

  const onResetRoom = () => {
    // รีเซ็ตสถานะห้องและผู้เล่น
    setRoomStatus(RoomStatus.WAITING);
  };

  const onExitRoom = async () => {
    if (!me) return;
    try {
      const resp = await leaveRoomService({
        roomCode: roomData.roomCode,
        playerUuid: me.uuid,
      });
      if (resp?.success) {
        queryClient.removeQueries({ queryKey: ["room"] });
        // TODO: Handle successful leave room
      }
    } catch (error) {
      console.log("Error leaving room:", error);
    }
    console.log("Leave room");
    router.push("/");
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
              {allPlayersReady && roomStatus === RoomStatus.READY && (
                <Tag
                  value="ทุกคนพร้อมแล้ว!"
                  severity="success"
                  icon="pi pi-check-circle"
                />
              )}
            </div>
          </div>

          {roomStatus !== RoomStatus.PLAYING && (
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
        {roomStatus === RoomStatus.WAITING && (
          <Card className="bg-blue-900/20 border-blue-500/30">
            <div className="flex items-center gap-3">
              <i className="pi pi-info-circle text-blue-400 text-xl" />
              <div>
                <p className="font-semibold mb-1">รอผู้เล่นพร้อม</p>
                <p className="text-sm text-gray-400">
                  ทุกคนต้องกดปุ่ม &quot;พร้อม&quot; ก่อนเริ่มเกม
                  (ต้องมีอย่างน้อย {MINIMUM_PLAYERS} คน)
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {roomStatus === RoomStatus.PLAYING ? (
        <PlayContainer
          roomCode={roomData.roomCode}
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
              {map(players, (player) => (
                <PlayerCard key={player.uuid} player={player} />
              ))}

              {/* Empty Slots */}
              {Array.from({ length: maxPlayers - players.length }).map(
                (_, index) => (
                  <PlayerCardEmpty key={`empty-${index}`} />
                )
              )}
            </div>
          </div>

          {/* Action Buttons - Fixed at Bottom */}
          <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-gray-800 p-4 z-30">
            <div className="container mx-auto max-w-6xl flex gap-4 justify-center">
              <Button
                label={currentPlayerMemorize?.ready ? "ยกเลิกพร้อม" : "พร้อม"}
                icon={
                  currentPlayerMemorize?.ready ? "pi pi-times" : "pi pi-check"
                }
                severity={
                  currentPlayerMemorize?.ready ? "secondary" : "success"
                }
                size="large"
                onClick={function () {
                  toggleReady();
                }}
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
                  รอผู้เล่น {players.filter((p) => !p.ready).length} คนกดพร้อม
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
