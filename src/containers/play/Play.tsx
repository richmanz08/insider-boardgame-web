"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "primereact/card";
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
}

export const PlayContainer: React.FC<PlayContainerProps> = ({
  players,
  roomCode,
  myJob,
  activeGame,
  onPlayEnd,
  onOpenCard,
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
  const [timeRemaining, setTimeRemaining] = useState(
    activeGame.durationSeconds ?? 0
  );
  const [allPlayersFlipped, setAllPlayersFlipped] = useState(false);

  const gameIsStarted = !isNull(activeGame.startedAt);

  // Mock: จำนวนผู้เล่นทั้งหมดและผู้เล่นที่เปิดการ์ดแล้ว

  const [currentUserId] = useState("2"); // Mock current user ID

  // ⭐ คำนวณเวลาจาก server time แทน client timer
  useEffect(() => {
    if (!gameIsStarted || !activeGame.startedAt) return;

    const updateTimeRemaining = () => {
      const now = Date.now();
      const gameStartTime = new Date(activeGame.startedAt!).getTime();
      const elapsed = Math.floor((now - gameStartTime) / 1000);
      const remaining = Math.max(
        0,
        (activeGame.durationSeconds || 0) - elapsed
      );

      setTimeRemaining(remaining);

      if (remaining <= 0) {
        console.log("Time's up!");
        // TODO: จบเกม
        return;
      }
    };

    // อัปเดททันทีและทุก 1 วินาที
    updateTimeRemaining();
    const timer = setInterval(updateTimeRemaining, 1000);

    // ⭐ Sync เวลาเมื่อ tab กลับมา active
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        updateTimeRemaining(); // Sync ทันทีเมื่อกลับมา
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [gameIsStarted, activeGame.startedAt, activeGame.durationSeconds]);

  const handleFlipCard = () => {
    setIsCardFlipped(true);
    onOpenCard();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleTimeUp = () => {
    console.log("Time's up! Game ended.");
    setGameEnded(true);
  };

  const handleEndGame = () => {
    console.log("Master ended game early.");
    setGameEnded(true);
  };

  const handleVoteComplete = (votedPlayerId: string) => {
    console.log("Voted for:", votedPlayerId);
    // TODO: Send vote to API/WebSocket
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
        roomId={roomCode}
        myPlayerId={currentUserId}
        myRole={myRole.role}
        onVoteComplete={handleVoteComplete}
        onNavigateToEndgame={handleScoreBoard}
      />
    );
  }

  // ถ้าเกมเริ่มแล้ว แสดงหน้าเล่นเกม
  if (gameIsStarted && myRole) {
    return (
      <GamePlay
        myRole={myRole}
        timeRemaining={timeRemaining}
        onTimeUp={handleTimeUp}
        onEndGame={handleEndGame}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Timer Bar - แสดงเมื่อเกมเริ่มแล้ว */}
      {gameIsStarted && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-700 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <i className="pi pi-clock text-2xl text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">เวลาที่เหลือ</p>
                  <p
                    className={`text-3xl font-bold ${
                      timeRemaining <= 60
                        ? "text-red-500 animate-pulse"
                        : timeRemaining <= 180
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {formatTime(timeRemaining)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">สถานะ</p>
                <p className="text-lg font-semibold text-green-400">
                  <i className="pi pi-play-circle mr-2" />
                  กำลังเล่น
                </p>
                {allPlayersFlipped && (
                  <p className="text-xs text-gray-400 mt-1">
                    ผู้เล่นครบ {players.length} คน
                  </p>
                )}
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  timeRemaining <= 60
                    ? "bg-red-500"
                    : timeRemaining <= 180
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${(timeRemaining / 600) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

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
          <div className="perspective-1000">
            <div
              className={`relative w-full max-w-md mx-auto transition-transform duration-700 transform-style-3d ${
                isCardFlipped ? "rotate-y-180" : ""
              }`}
              style={{
                transformStyle: "preserve-3d",
                minHeight: isCardFlipped ? "auto" : "400px",
              }}
            >
              {/* Card Back (ด้านหลัง) */}
              <div
                className={`absolute inset-0 backface-hidden ${
                  isCardFlipped ? "pointer-events-none" : ""
                }`}
              >
                <Card
                  className="bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-gray-600 cursor-pointer hover:border-blue-500 transition-all duration-300 hover:scale-105"
                  onClick={handleFlipCard}
                >
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 animate-pulse">
                      <i className="pi pi-question text-white text-6xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">???</h2>
                    <p className="text-gray-400 text-center">
                      คลิกเพื่อเปิดการ์ด
                    </p>
                  </div>
                </Card>
              </div>

              {/* Card Front (ด้านหน้า - เปิดแล้ว) */}
              <div
                className={`backface-hidden rotate-y-180 ${
                  isCardFlipped ? "relative" : "absolute inset-0"
                }`}
                style={{ transform: "rotateY(180deg)" }}
              >
                {myRole && (
                  <Card
                    className={`bg-gradient-to-br ${
                      getRoleDisplay(myRole.role).bgColor
                    } border-2 border-opacity-50`}
                  >
                    <div className="flex flex-col items-center justify-center py-8">
                      {/* Role Icon */}
                      <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-6">
                        <i
                          className={`pi ${
                            getRoleDisplay(myRole.role).icon
                          } text-white text-5xl`}
                        />
                      </div>

                      {/* Role Name */}
                      <h2 className="text-4xl font-bold text-white mb-6">
                        {getRoleDisplay(myRole.role).name}
                      </h2>

                      {/* Role Information */}
                      <div className="w-full space-y-4">
                        {myRole.role === RoleGame.CITIZEN && (
                          <>
                            <i className="pi pi-question-circle text-white text-3xl mb-3" />
                            <p className="text-white text-lg">
                              คุณไม่ทราบคำตอบ
                            </p>
                            <p className="text-gray-200 text-sm mt-2">
                              ถามคำถามเพื่อหาคำตอบ
                            </p>
                          </>
                        )}

                        {myRole.role === RoleGame.MASTER && (
                          <div className="space-y-3">
                            {/* Image Display */}
                            {myRole.answer && (
                              <div className="bg-gray-800 bg-opacity-60 rounded-lg p-3 overflow-hidden border border-gray-700">
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900 mb-3">
                                  <Image
                                    src="/images/disneyland.png"
                                    alt={myRole.answer || "Answer image"}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover rounded-lg"
                                    priority
                                  />
                                </div>
                              </div>
                            )}

                            {/* Answer */}
                            <div className="bg-gray-700 bg-opacity-70 rounded-lg p-3 border border-gray-600">
                              <p className="text-gray-300 text-xs mb-1">
                                คำตอบ:
                              </p>
                              <p className="text-white text-2xl font-bold">
                                {myRole.answer}
                              </p>
                            </div>

                            {/* Instruction */}
                            <div className="bg-yellow-500 bg-opacity-20 rounded-lg p-4">
                              <p className="text-yellow-200 text-sm">
                                <i className="pi pi-info-circle mr-2" />
                                คุณต้องให้คำใบ้ผู้เล่นแต่ไม่ให้รู้คำตอบ
                              </p>
                            </div>
                          </div>
                        )}

                        {myRole.role === RoleGame.INSIDER && (
                          <div className="space-y-3">
                            {/* Image Display */}
                            {myRole.answer && (
                              <div className="bg-gray-800 bg-opacity-60 rounded-lg p-3 overflow-hidden border border-gray-700">
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900 mb-3">
                                  <Image
                                    src="/images/disneyland.png"
                                    alt={myRole.answer || "Answer image"}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover rounded-lg"
                                    priority
                                  />
                                </div>
                              </div>
                            )}

                            {/* Answer */}
                            <div className="bg-gray-700 bg-opacity-70 rounded-lg p-3 border border-gray-600">
                              <p className="text-gray-300 text-xs mb-1">
                                คำตอบ:
                              </p>
                              <p className="text-white text-2xl font-bold">
                                {myRole.answer}
                              </p>
                            </div>

                            {/* Instruction */}
                            <div className="bg-red-500 bg-opacity-20 rounded-lg p-4">
                              <p className="text-red-200 text-sm">
                                <i className="pi pi-eye mr-2" />
                                คุณต้องบงการผู้เล่นให้ไปสู่คำตอบ
                                แต่อย่าให้ถูกจับได้!
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>

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
    </div>
  );
};
