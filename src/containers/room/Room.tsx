/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CountdownPlayModal } from "./CountdownPlay";
import { PlayContainer } from "../play/Play";
import { leaveRoomService } from "@/app/api/room/RoomService";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useQueryClient } from "@tanstack/react-query";
import { RoomData, RoomStatus } from "@/app/api/room/RoomInterface";
import { useRoomWebSocket } from "@/src/hooks/useRoomWebSocket";
import { useRoomHook } from "./hook";
import {
  ActiveGame,
  PlayerData,
  RoomUpdateMessage,
} from "@/src/hooks/interface";
import { HeaderRoom } from "./HeaderRoom";
import { RoomPlayersList } from "./RoomPlayers";
import { ScoreBoardContainer } from "../scoreboard/ScoreBoard";
import { Button } from "primereact/button";
import { MatchResult } from "../scoreboard/MatchResult";
import { set } from "lodash";
import { VotePlayer } from "../vote/VotePlayer";

interface RoomContainerProps {
  roomData: RoomData;
}

export const RoomContext = React.createContext<{
  room: RoomUpdateMessage | null;
  roomCode: string;
  isHost: boolean;
  allReady: boolean;
  my: PlayerData | null;
  // onShowScoreBoard: () => void;
  onExitRoom: () => void;
  onRevealingRole: (val: boolean) => void;
}>({
  room: null,
  roomCode: "",
  isHost: false,
  allReady: false,
  my: null,
  // onShowScoreBoard: () => {},
  onExitRoom: () => {},
  onRevealingRole: () => {},
});

export const RoomContainer: React.FC<RoomContainerProps> = ({ roomData }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { checkShowModalCountdownStart } = useRoomHook();
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

  const [showCountdown, setShowCountdown] = useState(false);
  const [hostStartGame, setHostStartGame] = useState(false);
  const [gameSummary, setGameSummary] = useState<ActiveGame | null>(null);
  const [showBoardTotalScore, setShowBoardTotalScore] = useState(false);
  const [isRevealingRole, setIsRevealingRole] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  // const [isLoadingShowBoard, setIsLoadingShowBoard] = useState(false);
  // console.log(
  //   "RoomContainer log data:",
  //   { room },
  //   { activeGame },
  //   { gameSummary },
  //   { showBoardTotalScore }
  // );
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
    if (activeGame && !showCountdown && room?.status === RoomStatus.WAITING) {
      setShowCountdown(true);
    }

    if (activeGame && activeGame.summary) {
      setGameSummary(activeGame);
    }
  }, [activeGame]);

  useEffect(() => {
    if (room?.type === "ROOM_RESET_AFTER_GAME") {
      setHostStartGame(false);
    }

    // if (room?.type === "GAME_FINISHED_WITH_SCORING") {
    //   setIsLoadingShowBoard(true);
    // }
  }, [room]);

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    console.log("Game started!");
    // TODO: เรียก API เริ่มเกม และ navigate ไปหน้าเกม
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

  console.log({ gameEnded, isRevealingRole }, { gameSummary, activeGame });

  return (
    <RoomContext.Provider
      value={{
        room: room,
        roomCode: roomData.roomCode,
        isHost: isHost,
        allReady: allPlayersReady,
        my: currentPlayerMemorize,
        // onShowScoreBoard: () => setShowBoardTotalScore(true),
        onExitRoom: onExitRoom,
        onRevealingRole: (val) => {
          setIsRevealingRole(val);
        },
      }}
    >
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Room Header */}
        <HeaderRoom />

        {showBoardTotalScore && gameSummary ? (
          <>
            {gameSummary ? (
              <MatchResult
                activeGame={gameSummary}
                onBackToRooms={function () {
                  setShowBoardTotalScore(false);
                  setGameSummary(null);
                  // setIsLoadingShowBoard(false);
                }}
              />
            ) : (
              <div>Loading...</div>
            )}
          </>
        ) : room.status === RoomStatus.PLAYING &&
          activeGame &&
          activeGame.privateMessage &&
          !gameEnded ? (
          <PlayContainer
            // players={room?.players || []}
            activeGame={activeGame}
            myJob={activeGame.privateMessage}
            onOpenCard={function () {
              handleCardOpened();
            }}
            onMasterRoleIsSetToVoteTime={function () {
              masterRoleIsSetToVoteTime();
            }}
            onGameTimeOut={function () {
              console.log("Game time out");
              setGameEnded(true);
            }}
          />
        ) : (isRevealingRole || gameEnded) && (activeGame || gameSummary) ? (
          <>
            <VotePlayer
              activeGame={activeGame || (gameSummary as ActiveGame)}
              onMyVote={playerVote}
              onHostSummary={() => hostSummary()}
              onVoteFinished={() => {
                setShowBoardTotalScore(true);
                setIsRevealingRole(false);
              }}
            />
          </>
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
      </div>
    </RoomContext.Provider>
  );
};
