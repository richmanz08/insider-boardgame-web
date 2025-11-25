"use client";
import React from "react";
import Image from "next/image";
import { Card } from "primereact/card";
import { RolePlay, AnswerType } from "./Play";

interface RoleAssignment {
  role: RolePlay;
  answerType?: AnswerType;
  answer?: string;
}

interface LobbyProps {
  myRole: RoleAssignment;
  isCardFlipped: boolean;
  gameStarted: boolean;
  flippedPlayers: number;
  totalPlayers: number;
  onFlipCard: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  myRole,
  isCardFlipped,
  gameStarted,
  flippedPlayers,
  totalPlayers,
  onFlipCard,
}) => {
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

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container max-w-4xl mx-auto flex-1 flex items-center justify-center">
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
                  onClick={onFlipCard}
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
                          <p className="text-white text-lg">คุณไม่ทราบคำตอบ</p>
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
                            <p className="text-gray-300 text-xs mb-1">คำตอบ:</p>
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
                            <p className="text-gray-300 text-xs mb-1">คำตอบ:</p>
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
