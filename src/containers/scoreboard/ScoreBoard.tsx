"use client";
import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { RoleGame } from "@/src/hooks/interface";
import { RuleUI } from "@/src/components/rules/RuleUI";

interface GameHistory {
  gameNumber: number;
  answer: string; // ชื่อสถานที่/สิ่งของ
  insiderCaught: boolean; // จับ insider ได้หรือไม่
  answerFound: boolean; // ตอบถูกหรือไม่ (ภายในเวลา)
  timeUp: boolean; // เวลาหมดหรือไม่
  playerRoles: {
    [playerId: string]: RoleGame;
  };
  scores: {
    [playerId: string]: number; // คะแนนที่ได้ในเกมนี้
  };
}

interface PlayerScore {
  id: string;
  name: string;
  totalScore: number;
  gamesAsInsider: number;
  gamesAsMaster: number;
  gamesAsPlayer: number;
}

interface ScoreBoardConProps {
  roomId?: string;
  onBackToRooms: () => void;
}

export const ScoreBoardContainer: React.FC<ScoreBoardConProps> = ({
  roomId,
  onBackToRooms,
}) => {
  console.log("Room ID:", roomId); // TODO: ดึงข้อมูลจาก API

  // Mock data: ประวัติเกมทั้งหมดในห้อง
  const [gameHistory] = useState<GameHistory[]>([
    {
      gameNumber: 1,
      answer: "สนามบิน",
      insiderCaught: true,
      answerFound: true,
      timeUp: false,
      playerRoles: {
        "1": RoleGame.CITIZEN,
        "2": RoleGame.MASTER,
        "3": RoleGame.INSIDER,
        "4": RoleGame.CITIZEN,
      },
      scores: {
        "1": 1, // Player ได้คะแนน (จับ insider ได้)
        "2": 0, // Master ไม่นับคะแนน
        "3": 1, // Insider ได้คะแนน (ตอบถูกแต่ถูกจับ)
        "4": 1, // Player ได้คะแนน (จับ insider ได้)
      },
    },
    {
      gameNumber: 2,
      answer: "โรงพยาบาล",
      insiderCaught: false,
      answerFound: true,
      timeUp: false,
      playerRoles: {
        "1": RoleGame.INSIDER,
        "2": RoleGame.CITIZEN,
        "3": RoleGame.MASTER,
        "4": RoleGame.CITIZEN,
      },
      scores: {
        "1": 2, // Insider ได้ 2 คะแนน (ตอบถูก + ไม่ถูกจับ)
        "2": 0, // Player ไม่ได้ (จับ insider ไม่ได้)
        "3": 0, // Master ไม่นับคะแนน
        "4": 0, // Player ไม่ได้ (จับ insider ไม่ได้)
      },
    },
    {
      gameNumber: 3,
      answer: "ห้างสรรพสินค้า",
      insiderCaught: false,
      answerFound: false,
      timeUp: true,
      playerRoles: {
        "1": RoleGame.CITIZEN,
        "2": RoleGame.INSIDER,
        "3": RoleGame.CITIZEN,
        "4": RoleGame.MASTER,
      },
      scores: {
        "1": 0, // Player ไม่ได้ (ตอบไม่ถูก)
        "2": 0, // Insider ไม่ได้ (ตอบไม่ถูก)
        "3": 0, // Player ไม่ได้ (ตอบไม่ถูก)
        "4": 0, // Master ไม่นับคะแนน
      },
    },
  ]);

  // Mock: ข้อมูลผู้เล่น
  const [players] = useState([
    { id: "1", name: "PlayerOne" },
    { id: "2", name: "You" },
    { id: "3", name: "GameMaster" },
    { id: "4", name: "Newbie" },
  ]);

  // คำนวณคะแนนรวมของแต่ละคน
  const calculatePlayerScores = (): PlayerScore[] => {
    return players.map((player) => {
      let totalScore = 0;
      let gamesAsInsider = 0;
      let gamesAsMaster = 0;
      let gamesAsPlayer = 0;

      gameHistory.forEach((game) => {
        const role = game.playerRoles[player.id];
        const score = game.scores[player.id] || 0;

        totalScore += score;

        if (role === RoleGame.INSIDER) gamesAsInsider++;
        else if (role === RoleGame.MASTER) gamesAsMaster++;
        else if (role === RoleGame.CITIZEN) gamesAsPlayer++;
      });

      return {
        id: player.id,
        name: player.name,
        totalScore,
        gamesAsInsider,
        gamesAsMaster,
        gamesAsPlayer,
      };
    });
  };

  const playerScores = calculatePlayerScores().sort(
    (a, b) => b.totalScore - a.totalScore
  );

  const getRoleIcon = (role: RoleGame) => {
    switch (role) {
      case RoleGame.INSIDER:
        return "pi-eye";
      case RoleGame.MASTER:
        return "pi-crown";
      case RoleGame.CITIZEN:
        return "pi-user";
    }
  };

  const getRoleColor = (role: RoleGame) => {
    switch (role) {
      case RoleGame.INSIDER:
        return "text-red-500";
      case RoleGame.MASTER:
        return "text-purple-500";
      case RoleGame.CITIZEN:
        return "text-blue-500";
    }
  };

  const handlePlayAgain = () => {
    // TODO: Reset game and start new round
    console.log("Play again");
    onBackToRooms();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="container mx-auto max-w-7xl pt-8 pb-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent">
            🏆 สรุปผลเกม
          </h1>
          <p className="text-gray-400 text-lg">คะแนนรวมของทุกเกมในห้องนี้</p>
        </div>

        {/* Winner Card */}
        {playerScores.length > 0 && (
          <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
            <Card className="bg-gradient-to-br from-yellow-600 to-orange-700 border-2 border-yellow-500">
              <div className="text-center py-6">
                <i className="pi pi-trophy text-6xl text-white mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">ผู้ชนะ!</h2>
                <p className="text-5xl font-bold text-white mb-2">
                  {playerScores[0].name}
                </p>
                <p className="text-2xl text-yellow-100">
                  {playerScores[0].totalScore} คะแนน
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Score Table */}
        <div className="mb-8 overflow-x-auto">
          <Card className="bg-gray-800 border-2 border-gray-700">
            <div className="p-4">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <i className="pi pi-chart-bar text-blue-400" />
                ตารางคะแนน
              </h3>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b-2 border-gray-700">
                      <th className="text-left p-3 text-gray-400">เกม</th>
                      <th className="text-left p-3 text-gray-400">สถานที่</th>
                      {players.map((player) => (
                        <th
                          key={player.id}
                          className="text-center p-3 text-gray-400"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-semibold">{player.name}</span>
                            <span className="text-2xl font-bold text-yellow-400">
                              {
                                playerScores.find((p) => p.id === player.id)
                                  ?.totalScore
                              }
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {gameHistory.map((game) => (
                      <tr
                        key={game.gameNumber}
                        className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="p-3 font-semibold text-gray-300">
                          เกม {game.gameNumber}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-white">
                              {game.answer}
                            </span>
                            <div className="flex gap-2 mt-1">
                              {game.answerFound && (
                                <span className="text-xs bg-green-600 px-2 py-0.5 rounded">
                                  ✓ ตอบถูก
                                </span>
                              )}
                              {game.timeUp && (
                                <span className="text-xs bg-red-600 px-2 py-0.5 rounded">
                                  ⏰ หมดเวลา
                                </span>
                              )}
                              {game.insiderCaught && (
                                <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">
                                  🎯 จับได้
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        {players.map((player) => {
                          const role = game.playerRoles[player.id];
                          const score = game.scores[player.id] || 0;
                          return (
                            <td key={player.id} className="p-3 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <i
                                  className={`pi ${getRoleIcon(
                                    role
                                  )} text-2xl ${getRoleColor(role)}`}
                                />
                                {score > 0 && (
                                  <span className="text-lg font-bold text-yellow-400">
                                    +{score}
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {gameHistory.map((game) => (
                  <Card
                    key={game.gameNumber}
                    className="bg-gray-700 border border-gray-600"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-white">
                            เกม {game.gameNumber}
                          </h4>
                          <p className="text-yellow-400 font-semibold">
                            {game.answer}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          {game.answerFound && (
                            <span className="text-xs bg-green-600 px-2 py-0.5 rounded">
                              ✓ ตอบถูก
                            </span>
                          )}
                          {game.timeUp && (
                            <span className="text-xs bg-red-600 px-2 py-0.5 rounded">
                              ⏰ หมดเวลา
                            </span>
                          )}
                          {game.insiderCaught && (
                            <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">
                              🎯 จับได้
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {players.map((player) => {
                          const role = game.playerRoles[player.id];
                          const score = game.scores[player.id] || 0;
                          return (
                            <div
                              key={player.id}
                              className="bg-gray-800 rounded p-2 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <i
                                  className={`pi ${getRoleIcon(
                                    role
                                  )} ${getRoleColor(role)}`}
                                />
                                <span className="text-white text-sm">
                                  {player.name}
                                </span>
                              </div>
                              {score > 0 && (
                                <span className="text-yellow-400 font-bold">
                                  +{score}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Scoring Rules */}
        <RuleUI />

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 z-30">
          <div className="container mx-auto max-w-7xl flex gap-3 justify-center">
            <Button
              label="กลับไปหน้าห้อง"
              icon="pi pi-refresh"
              size="large"
              className="flex-1 md:flex-none"
              onClick={handlePlayAgain}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
