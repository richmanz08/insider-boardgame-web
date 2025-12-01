/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CountdownPlayModal } from "./CountdownPlay";
import { EditRoomModal, EditRoomFormData } from "./EditRoom";
import { PlayContainer } from "../play/Play";
import { leaveRoomService } from "@/app/api/room/RoomService";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useQueryClient } from "@tanstack/react-query";
import { RoomData, RoomStatus } from "@/app/api/room/RoomInterface";
import { useRoomWebSocket } from "@/src/hooks/useRoomWebSocket";
import { useRoomHook } from "./hook";
import { ActiveGame, RoomUpdateMessage } from "@/src/hooks/interface";
import { HeaderRoom } from "./HeaderRoom";
import { RoomPlayersList } from "./RoomPlayers";
import { ScoreBoardContainer } from "../scoreboard/ScoreBoard";

interface RoomContainerProps {
  roomData: RoomData;
}

export const RoomContext = React.createContext<{
  room: RoomUpdateMessage | null;
  roomCode: string;
  isHost: boolean;
  onShowScoreBoard: () => void;
}>({
  room: null,
  roomCode: "",
  isHost: false,
  onShowScoreBoard: () => {},
});

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
    hostSummary,
  } = useRoomWebSocket(roomData.roomCode, me ? me.uuid : "");

  console.log("RoomContainer log data:", { room }, { activeGame });

  const [roomName, setRoomName] = useState(roomData.roomName);
  const [roomStatus, setRoomStatus] = useState<RoomStatus>(roomData.status);
  const [maxPlayers, setMaxPlayers] = useState(roomData.maxPlayers);
  const [hasPassword, setHasPassword] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [hostStartGame, setHostStartGame] = useState(false);
  const [gameSummary, setGameSummary] = useState<ActiveGame | null>(null);
  const [showBoardTotalScore, setShowBoardTotalScore] = useState(false);

  const allPlayersReady =
    (room?.players.every((p) => p.ready) ?? false) &&
    (room?.players?.length ?? 0) > 5;

  const currentPlayerMemorize = React.useMemo(() => {
    return room?.players.find((p) => p.uuid === me?.uuid);
  }, [room, me]);

  const isHost = currentPlayerMemorize?.uuid === room?.hostUuid;

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

    if (activeGame && activeGame.summary) {
      setGameSummary(activeGame);
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
    <RoomContext.Provider
      value={{
        room: room,
        roomCode: roomData.roomCode,
        isHost: isHost,
        onShowScoreBoard: () => setShowBoardTotalScore(true),
      }}
    >
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

        {showBoardTotalScore && gameSummary ? (
          <ScoreBoardContainer
            roomId={roomData.roomCode}
            onBackToRooms={function () {
              setShowBoardTotalScore(false);
              setGameSummary(null);
            }}
          />
        ) : roomStatus === RoomStatus.PLAYING &&
          activeGame &&
          activeGame.privateMessage ? (
          <PlayContainer
            // players={room?.players || []}
            isHost={isHost}
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
            onPlayerVote={function (targetPlayerUuid: string) {
              playerVote(targetPlayerUuid);
            }}
            onHostSummary={function () {
              hostSummary();
            }}
          />
        ) : (
          <RoomPlayersList
            room={room}
            me={currentPlayerMemorize}
            allReady={allPlayersReady}
            onToggleReady={function () {
              toggleReady();
            }}
          />
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
    </RoomContext.Provider>
  );
};
