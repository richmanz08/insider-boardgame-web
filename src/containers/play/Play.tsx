/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { GamePlay } from "./GamePlay";
import { VotePlayer } from "./VotePlayer";
import { ScoreBoardContainer } from "./ScoreBoard";
import {
  ActiveGame,
  GamePrivateMessage,
  PlayerData,
  RoleGame,
} from "@/src/hooks/interface";
import { usePlayHook } from "./hook";
import { WaitingOpenCardBox } from "./WaitingOpenCardBox";
import { isNull } from "lodash";
import { BarGameTime } from "./BarGameTime";
import { DraftRoleCard } from "@/src/components/card/DraftRoleCard";

export interface RoleAssignment {
  role: RoleGame;
  answer?: string; // MASTER จะรู้คำตอบที่แท้จริง
}

interface PlayContainerProps {
  players: PlayerData[];
  myJob: GamePrivateMessage;
  roomCode: string;
  activeGame: ActiveGame;
  onPlayEnd: () => void;
  onOpenCard: () => void;
  onMasterRoleIsSetToVoteTime: () => void;
  onPlayerVote: (targetPlayerUuid: string) => void;
}

export const PlayContainer: React.FC<PlayContainerProps> = ({
  players,
  roomCode,
  myJob,
  activeGame,
  onPlayEnd,
  onOpenCard,
  onMasterRoleIsSetToVoteTime,
  onPlayerVote,
}) => {
  // console.log("Room PlayContainer:", roomCode, myJob, activeGame); // TODO: ใช้ดึงข้อมูลเกมจาก API

  const { getRoleDisplay } = usePlayHook();

  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const myRole: RoleAssignment = {
    role: myJob.role,
    ...(myJob.word && { answer: myJob.word }),
  };
  const [isLoading, setIsLoading] = useState(true);
  // const [gameIsStarted, setgameIsStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false); // เมื่อเวลาหมดหรือ Master จบเกม
  const [showBoardTotalScore, setShowBoardTotalScore] = useState(false); // แสดงหน้าสรุปผล
  // ⭐ คำนวณ initial time จาก endsAt แทน durationSeconds
  const [timeRemaining, setTimeRemaining] = useState(() => {
    if (!activeGame.endsAt) return 100;

    const now = new Date().getTime();
    const gameEndTime = new Date(activeGame.endsAt).getTime();
    return Math.max(0, Math.floor((gameEndTime - now) / 1000));
  });

  console.log({ activeGame, timeRemaining });

  // const [allPlayersFlipped, setAllPlayersFlipped] = useState(false);

  const gameIsStarted = !isNull(activeGame.startedAt);

  // Mock: จำนวนผู้เล่นทั้งหมดและผู้เล่นที่เปิดการ์ดแล้ว

  const [currentUserId] = useState("2"); // Mock current user ID

  // ⭐ คำนวณเวลาจาก endsAt (แม่นยำกว่า startedAt + duration)
  useEffect(() => {
    if (!gameIsStarted || gameEnded) return;
    let isComponentMounted = true;
    const updateTimeRemaining = () => {
      if (!isComponentMounted) return;

      const now = Date.now();
      let remaining = 0;

      if (activeGame.endsAt) {
        // ✅ วิธีแม่นยำ: ใช้ endsAt
        const gameEndTime = new Date(activeGame.endsAt).getTime();
        remaining = Math.max(0, Math.floor((gameEndTime - now) / 1000));
      }

      setTimeRemaining(remaining);

      if (remaining <= 0) {
        console.log("⏰ Time's up!");
        setGameEnded(true); // ⭐ เซ็ต state โดยตรง
        return;
      }
    };

    // อัปเดททันทีและทุก 1 วินาที
    updateTimeRemaining();
    const timerRef = setInterval(updateTimeRemaining, 1000);

    // ⭐ Sync เวลาเมื่อ tab กลับมา active (สำคัญสำหรับ refresh!)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isComponentMounted) {
        updateTimeRemaining(); // Sync ทันทีเมื่อกลับมา
        console.log("🔄 Timer synced after tab became visible");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isComponentMounted = false; // ⭐ ป้องกัน memory leak
      clearInterval(timerRef);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    gameIsStarted,
    activeGame.endsAt,
    activeGame.startedAt,
    activeGame.durationSeconds,
    gameEnded,
  ]); // ⭐ เพิ่ม dependencies

  const allPlayersHaveFlipped = useMemo(() => {
    return players.every((player) => activeGame.cardOpened[player.uuid]);
  }, [players]);

  const handleFlipCard = () => {
    setIsCardFlipped(true);
    setTimeout(() => {
      onOpenCard();
    }, 2500);
  };

  const handleTimeUp = () => {
    console.log("Time's up! Game ended.");
    setGameEnded(true);
  };

  const handleEndGame = () => {
    console.log("Master ended game early.");
    setGameEnded(true);
  };

  const handleScoreBoard = () => {
    console.log("Navigate to endgame summary");
    setShowBoardTotalScore(true);
    setGameEnded(false);
  };

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <i className="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4" />
  //         <p className="text-xl text-gray-400">กำลังแจกบทบาท...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // ถ้าแสดงหน้าสรุปผลแล้ว
  if (showBoardTotalScore) {
    return (
      <ScoreBoardContainer
        roomId={roomCode}
        onBackToRooms={function () {
          onPlayEnd();
        }}
      />
    );
  }

  // ถ้าเกมจบแล้ว แสดงหน้าโหวต
  if (gameEnded && myRole) {
    return (
      <VotePlayer
        players={players}
        roomId={roomCode}
        myPlayerId={currentUserId}
        myRole={myRole.role}
        onNavigateToEndgame={handleScoreBoard}
        onMyVote={onPlayerVote}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Timer Bar - แสดงเมื่อเกมเริ่มแล้ว */}
      <BarGameTime
        isStarted={gameIsStarted}
        timeRemaining={timeRemaining}
        myRole={myRole}
        actionMasterEndGame={onMasterRoleIsSetToVoteTime}
      />
      {gameIsStarted ? (
        <GamePlay
          myRole={myRole}
          timeRemaining={timeRemaining}
          onTimeUp={handleTimeUp}
        />
      ) : (
        <div
          className={`container max-w-4xl mx-auto flex-1 flex items-center justify-center ${
            gameIsStarted ? "mt-32" : ""
          }`}
        >
          {/* Header */}
          <div className="w-full">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                บทบาทของคุณ
              </h1>
              {!gameIsStarted ? (
                <p className="text-gray-400">คลิกที่การ์ดเพื่อเปิดดู</p>
              ) : (
                <p className="text-green-400 font-semibold animate-pulse">
                  <i className="pi pi-check-circle mr-2" />
                  เกมเริ่มแล้ว!
                </p>
              )}
            </div>

            {/* Card Container */}
            <DraftRoleCard
              isCardFlipped={isCardFlipped}
              onFlipCard={handleFlipCard}
              my={myRole}
              activeGame={activeGame}
            />

            {/* Waiting for other players */}
            {!gameIsStarted && (
              <WaitingOpenCardBox
                players={players}
                openedCard={activeGame.cardOpened}
              />
            )}

            {/* Warning */}
            <div className="mt-8 text-center">
              <p className="text-sm text-yellow-500">
                <i className="pi pi-exclamation-triangle mr-2" />
                อย่าให้ผู้เล่นคนอื่นเห็นบทบาทของคุณ!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
