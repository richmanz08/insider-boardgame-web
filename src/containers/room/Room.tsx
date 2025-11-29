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
import { GameSummaryDto } from "@/src/hooks/interface";
import { HeaderRoom } from "./HeaderRoom";

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
    room,
    activeGame,
    toggleReady,
    startGame,
    handleCardOpened,
    masterRoleIsSetToVoteTime,
    playerVote,
  } = useRoomWebSocket(roomData.roomCode, me ? me.uuid : "");

  console.log("RoomContainer log data:", { room }, { activeGame });

  const [roomName, setRoomName] = useState(roomData.roomName);
  const [roomStatus, setRoomStatus] = useState<RoomStatus>(roomData.status);
  const [maxPlayers, setMaxPlayers] = useState(roomData.maxPlayers);
  const [hasPassword, setHasPassword] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [hostStartGame, setHostStartGame] = useState(false);

  const allPlayersReady = room?.players.every((p) => p.ready) ?? false;

  const currentPlayerMemorize = React.useMemo(() => {
    return room?.players.find((p) => p.uuid === me?.uuid);
  }, [room, me]);

  const isHost = currentPlayerMemorize?.host || false;

  // Display countdown automatically when all players are ready and user is host
  useEffect(() => {
    if (activeGame || !isHost || hostStartGame) return;
    const isReadyToStart = checkShowModalCountdownStart(room?.players || []);
    if (isReadyToStart) {
      const timer = setTimeout(() => {
        startGame();
        setHostStartGame(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [room, startGame]);

  useEffect(() => {
    if (activeGame && !showCountdown && roomStatus === RoomStatus.WAITING) {
      setShowCountdown(true);
    }
  }, [activeGame]);

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setRoomStatus(RoomStatus.PLAYING);
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

  const CountdownModalMemo = React.useMemo(() => {
    return (
      <CountdownPlayModal
        open={showCountdown}
        onCountdownComplete={handleCountdownComplete}
      />
    );
  }, [showCountdown]);

  if (!room || !currentPlayerMemorize) return null;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Room Header */}
      <HeaderRoom
        room={room}
        roomName={roomName}
        hasPassword={hasPassword}
        roomStatus={roomStatus}
        maxPlayers={maxPlayers}
        allPlayersReady={allPlayersReady}
        isHost={isHost}
        currentPlayerMemorize={currentPlayerMemorize}
        setShowEditModal={setShowEditModal}
        onExitRoom={onExitRoom}
      />

      {roomStatus === RoomStatus.PLAYING &&
      activeGame &&
      activeGame.privateMessage ? (
        <PlayContainer
          players={room?.players || []}
          activeGame={activeGame}
          myJob={activeGame.privateMessage}
          roomCode={roomData.roomCode}
          onOpenCard={function () {
            handleCardOpened();
          }}
          onPlayEnd={function () {
            onResetRoom();
          }}
          onMasterRoleIsSetToVoteTime={function () {
            masterRoleIsSetToVoteTime();
          }}
        />
      ) : (
        <>
          {/* Players Grid */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">ผู้เล่นในห้อง</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {map(room?.players || [], (player) => (
                <PlayerCard key={player.uuid} player={player} />
              ))}

              {/* Empty Slots */}
              {Array.from({
                length: maxPlayers - (room?.players.length || 0),
              }).map((_, index) => (
                <PlayerCardEmpty key={`empty-${index}`} />
              ))}
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
                  รอผู้เล่น {room?.players.filter((p) => !p.ready).length}{" "}
                  คนกดพร้อม
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* Countdown Modal */}
      {CountdownModalMemo}

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
