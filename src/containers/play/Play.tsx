/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { GamePlay } from "./GamePlay";
// import { VotePlayer } from "./VotePlayer";
import {
  ActiveGame,
  GamePrivateMessage,
  RoleGame,
} from "@/src/hooks/interface";
import { WaitingOpenCardBox } from "./WaitingOpenCardBox";
// import { isNull } from "lodash";
import { BarGameTime } from "./BarGameTime";
import { DraftRoleCard } from "@/src/components/card/DraftRoleCard";
// import { RoomContext } from "../room/Room";

export interface RoleAssignment {
  role: RoleGame;
  answer?: string; // MASTER จะรู้คำตอบที่แท้จริง
}

interface PlayContainerProps {
  myJob: GamePrivateMessage;
  activeGame: ActiveGame;
  onOpenCard: () => void;
  onMasterRoleIsSetToVoteTime: () => void;
  onGameTimeOut: () => void;
}

export const PlayContainer: React.FC<PlayContainerProps> = ({
  myJob,
  activeGame,
  onOpenCard,
  onMasterRoleIsSetToVoteTime,
  onGameTimeOut,
}) => {
  const players = activeGame.playerInGame;
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const myRole: RoleAssignment = {
    role: myJob.role,
    ...(myJob.word && { answer: myJob.word }),
  };

  const [gameEnded, setGameEnded] = useState(false); // เมื่อเวลาหมดหรือ Master จบเกม
  const [gameIsStarted, setGameIsStarted] = useState(false);
  // ⭐ คำนวณ initial time จาก endsAt แทน durationSeconds
  const [timeRemaining, setTimeRemaining] = useState(() => {
    if (!activeGame.endsAt) return 100;

    const now = new Date().getTime();
    const gameEndTime = new Date(activeGame.endsAt).getTime();
    return Math.max(0, Math.floor((gameEndTime - now) / 1000));
  });

  console.log({ timeRemaining }, activeGame.durationSeconds);

  // const gameIsStarted = !isNull(activeGame.startedAt);

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
        onGameTimeOut();
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

  useLayoutEffect(() => {
    if (activeGame.startedAt) {
      if (activeGame.durationSeconds - timeRemaining < 3) {
        setTimeout(() => {
          setGameIsStarted(true);
        }, 2000);
      } else {
        setGameIsStarted(true);
      }
    }
  }, [activeGame]);

  const handleFlipCard = () => {
    setIsCardFlipped(true);
    onOpenCard();
  };

  const handleTimeUp = () => {
    console.log("Time's up! Game ended.");
    setGameEnded(true);
  };

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
