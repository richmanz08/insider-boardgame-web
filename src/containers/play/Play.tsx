"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "primereact/card";
import { GamePlay } from "./GamePlay";
import { VotePlayer } from "./VotePlayer";
import { ScoreBoardContainer } from "./ScoreBoard";

export enum RolePlay {
  INSIDER = "INSIDER",
  MASTER = "MASTER",
  PLAYER = "PLAYER",
}

export enum AnswerType {
  PLACE = "PLACE", // สถานที่
  THING = "THING", // สิ่งของ
}

interface RoleAssignment {
  role: RolePlay;
  answerType?: AnswerType; // MASTER และ INSIDER จะรู้ว่าเป็นสถานที่หรือสิ่งของ
  answer?: string; // MASTER จะรู้คำตอบที่แท้จริง
}

interface PlayContainerProps {
  roomId?: string;
}

export const PlayContainer: React.FC<PlayContainerProps> = ({ roomId }) => {
  console.log("Room ID:", roomId); // TODO: ใช้ดึงข้อมูลเกมจาก API

  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [myRole, setMyRole] = useState<RoleAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false); // เมื่อเวลาหมดหรือ Master จบเกม
  const [showBoardTotalScore, setShowBoardTotalScore] = useState(false); // แสดงหน้าสรุปผล
  const [timeRemaining, setTimeRemaining] = useState(30); // 10 นาที = 600 วินาที
  const [allPlayersFlipped, setAllPlayersFlipped] = useState(false);

  // Mock: จำนวนผู้เล่นทั้งหมดและผู้เล่นที่เปิดการ์ดแล้ว
  const [totalPlayers] = useState(4); // TODO: ดึงจาก API
  const [flippedPlayers, setFlippedPlayers] = useState(0);
  const [currentUserId] = useState("2"); // Mock current user ID

  // Mock function: สุ่มบทบาทและคำตอบ
  useEffect(() => {
    const assignRole = () => {
      // TODO: เรียก API เพื่อดึงบทบาทที่ระบบแจกให้
      // ตอนนี้ใช้ mock data
      const roles: RolePlay[] = [
        RolePlay.PLAYER,
        RolePlay.MASTER,
        RolePlay.INSIDER,
      ];
      const answerTypes: AnswerType[] = [AnswerType.PLACE, AnswerType.THING];

      // สุ่มบทบาท
      //   const randomRole = roles[Math.floor(Math.random() * roles.length)];
      const randomRole = roles[0];
      const randomAnswerType =
        answerTypes[Math.floor(Math.random() * answerTypes.length)];

      // ตัวอย่างคำตอบ
      const placeAnswers = [
        "สนามบิน",
        "โรงพยาบาล",
        "ห้างสรรพสินค้า",
        "โรงเรียน",
        "สวนสาธารณะ",
      ];
      const thingAnswers = [
        "มือถือ",
        "แว่นตา",
        "กระเป๋า",
        "รองเท้า",
        "หนังสือ",
      ];

      const randomAnswer =
        randomAnswerType === AnswerType.PLACE
          ? placeAnswers[Math.floor(Math.random() * placeAnswers.length)]
          : thingAnswers[Math.floor(Math.random() * thingAnswers.length)];

      const assignment: RoleAssignment = {
        role: randomRole,
      };

      // MASTER รู้ทั้งประเภทและคำตอบ
      if (randomRole === RolePlay.MASTER) {
        assignment.answerType = randomAnswerType;
        assignment.answer = randomAnswer;
      }
      // INSIDER รู้เฉพาะประเภทและคำตอบ (เหมือน MASTER)
      else if (randomRole === RolePlay.INSIDER) {
        assignment.answerType = randomAnswerType;
        assignment.answer = randomAnswer;
      }
      // PLAYER ไม่รู้อะไรเลย

      setMyRole(assignment);
      setIsLoading(false);
    };

    // Simulate API delay
    const timer = setTimeout(assignRole, 1000);
    return () => clearTimeout(timer);
  }, []);

  // จำลองการที่ผู้เล่นคนอื่นเปิดการ์ด (ใน production จะใช้ WebSocket)
  useEffect(() => {
    if (isCardFlipped) {
      // TODO: ส่งสัญญาณไปยัง WebSocket ว่าผู้เล่นคนนี้เปิดการ์ดแล้ว
      console.log("Card flipped, notifying other players...");
      setFlippedPlayers(1); // เริ่มจากตัวเอง

      // Mock: จำลองผู้เล่นคนอื่นเปิดการ์ดทีละคน
      const intervals: NodeJS.Timeout[] = [];

      for (let i = 2; i <= totalPlayers; i++) {
        const timer = setTimeout(() => {
          setFlippedPlayers(i);
          console.log(`Player ${i} flipped card`);

          // เมื่อทุกคนเปิดการ์ดครบแล้ว
          if (i === totalPlayers) {
            setTimeout(() => {
              setAllPlayersFlipped(true);
              setGameStarted(true);
              console.log("All players ready! Game starting...");
            }, 500);
          }
        }, i * 1000); // แต่ละคนห่างกัน 1 วินาที

        intervals.push(timer);
      }

      return () => intervals.forEach(clearTimeout);
    }
  }, [isCardFlipped, totalPlayers]);

  // เริ่มนับเวลาถอยหลังเมื่อทุกคนเปิดการ์ดแล้ว
  useEffect(() => {
    if (gameStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            console.log("Time's up!");
            // TODO: จบเกม
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameStarted, timeRemaining]);

  const handleFlipCard = () => {
    setIsCardFlipped(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getAnswerTypeDisplay = (type: AnswerType) => {
    return type === AnswerType.PLACE ? "สถานที่" : "สิ่งของ";
  };

  const getRoleDisplay = (role: RolePlay) => {
    switch (role) {
      case RolePlay.INSIDER:
        return {
          name: "Insider",
          color: "text-red-500",
          bgColor: "from-red-600 to-red-800",
          icon: "pi-eye",
        };
      case RolePlay.MASTER:
        return {
          name: "Master",
          color: "text-purple-500",
          bgColor: "from-purple-600 to-purple-800",
          icon: "pi-crown",
        };
      case RolePlay.PLAYER:
        return {
          name: "Player",
          color: "text-blue-500",
          bgColor: "from-blue-600 to-blue-800",
          icon: "pi-user",
        };
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4" />
          <p className="text-xl text-gray-400">กำลังแจกบทบาท...</p>
        </div>
      </div>
    );
  }

  // ถ้าแสดงหน้าสรุปผลแล้ว
  if (showBoardTotalScore) {
    return (
      <ScoreBoardContainer
        roomId={roomId}
        onBackToRooms={function () {
          setShowBoardTotalScore(false);
        }}
      />
    );
  }

  // ถ้าเกมจบแล้ว แสดงหน้าโหวต
  if (gameEnded && myRole) {
    return (
      <VotePlayer
        roomId={roomId}
        myPlayerId={currentUserId}
        myRole={myRole.role}
        onVoteComplete={handleVoteComplete}
        onNavigateToEndgame={handleScoreBoard}
      />
    );
  }

  // ถ้าเกมเริ่มแล้ว แสดงหน้าเล่นเกม
  if (gameStarted && myRole) {
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
      {gameStarted && (
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
                    ผู้เล่นครบ {totalPlayers} คน
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
          gameStarted ? "mt-32" : ""
        }`}
      >
        {/* Header */}
        <div className="w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              บทบาทของคุณ
            </h1>
            {!gameStarted ? (
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
                        {myRole.role === RolePlay.PLAYER && (
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

                        {myRole.role === RolePlay.MASTER && (
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

                            {/* Answer Type */}
                            <div className="bg-gray-800 bg-opacity-60 rounded-lg p-3 border border-gray-700">
                              <p className="text-gray-300 text-xs mb-1">
                                ประเภท:
                              </p>
                              <p className="text-white text-lg font-bold">
                                {myRole.answerType &&
                                  getAnswerTypeDisplay(myRole.answerType)}
                              </p>
                            </div>

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

                        {myRole.role === RolePlay.INSIDER && (
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

                            {/* Answer Type */}
                            <div className="bg-gray-800 bg-opacity-60 rounded-lg p-3 border border-gray-700">
                              <p className="text-gray-300 text-xs mb-1">
                                ประเภท:
                              </p>
                              <p className="text-white text-lg font-bold">
                                {myRole.answerType &&
                                  getAnswerTypeDisplay(myRole.answerType)}
                              </p>
                            </div>

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
          {isCardFlipped && !gameStarted && (
            <div className="text-center mt-8 animate-fade-in">
              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6 inline-block min-w-[300px]">
                <i className="pi pi-spin pi-spinner text-3xl text-blue-400 mb-3" />
                <p className="text-lg text-blue-300 font-semibold mb-3">
                  รอผู้เล่นคนอื่นเปิดการ์ด...
                </p>

                {/* Player counter */}
                <div className="bg-blue-800/50 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                    <span className="text-green-400">{flippedPlayers}</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-white">{totalPlayers}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    ผู้เล่นที่เปิดการ์ดแล้ว
                  </p>
                </div>

                {/* Progress indicators */}
                <div className="flex justify-center gap-2">
                  {Array.from({ length: totalPlayers }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index < flippedPlayers
                          ? "bg-green-500 scale-110"
                          : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-400 mt-4">
                  เกมจะเริ่มอัตโนมัติเมื่อทุกคนพร้อม
                </p>
              </div>
            </div>
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
