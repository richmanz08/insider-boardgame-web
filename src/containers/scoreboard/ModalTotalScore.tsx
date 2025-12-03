"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { getHistoryGameService } from "@/app/api/game/GameService";
import { GameHistoryData } from "@/app/api/game/GameInterface";
import { RoleGame } from "@/src/hooks/interface";
import { get } from "lodash";

interface ModalTotalScoreProps {
  visible: boolean;
  onHide: () => void;
  roomCode: string;
}

interface PlayerScore {
  uuid: string;
  name: string;
  totalScore: number;
}

export const ModalTotalScore: React.FC<ModalTotalScoreProps> = ({
  visible,
  onHide,
  roomCode,
}) => {
  const [gameHistory, setGameHistory] = useState<GameHistoryData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGameHistory = async () => {
      setIsLoading(true);
      try {
        const response = await getHistoryGameService(roomCode);
        if (response?.success && response.data) {
          setGameHistory(response.data);
        }
      } catch (error) {
        console.error("Error fetching game history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (visible && roomCode) {
      fetchGameHistory();
    }
  }, [visible, roomCode]);

  // คำนวณคะแนนรวมของแต่ละผู้เล่น
  const playerScores = useMemo<PlayerScore[]>(() => {
    const scoreMap: Record<string, { name: string; total: number }> = {};

    gameHistory.forEach((game) => {
      game.players.forEach((player) => {
        if (!scoreMap[player.uuid]) {
          scoreMap[player.uuid] = { name: player.playerName, total: 0 };
        }
        scoreMap[player.uuid].total += get(game?.scores, player.uuid, 0);
      });
    });

    return Object.entries(scoreMap)
      .map(([uuid, data]) => ({
        uuid,
        name: data.name,
        totalScore: data.total,
      }))
      .sort((a, b) => b.totalScore - a.totalScore);
  }, [gameHistory]);

  // รวมผู้เล่นทั้งหมดจากทุกเกม
  const allPlayers = useMemo(() => {
    const playersMap = new Map<string, string>();
    gameHistory.forEach((game) => {
      game.players.forEach((player) => {
        playersMap.set(player.uuid, player.playerName);
      });
    });
    return Array.from(playersMap.entries()).map(([uuid, name]) => ({
      uuid,
      name,
    }));
  }, [gameHistory]);

  const getRoleIcon = (role: RoleGame) => {
    switch (role) {
      case RoleGame.MASTER:
        return "pi-crown";
      case RoleGame.INSIDER:
        return "pi-eye";
      case RoleGame.CITIZEN:
        return "pi-user";
      default:
        return "pi-question";
    }
  };

  const getRoleColor = (role: RoleGame) => {
    switch (role) {
      case RoleGame.MASTER:
        return "text-purple-400";
      case RoleGame.INSIDER:
        return "text-red-400";
      case RoleGame.CITIZEN:
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  const footer = (
    <div className="flex justify-end gap-2">
      <Button
        label="ปิด"
        icon="pi pi-times"
        onClick={onHide}
        className="p-button-text"
      />
    </div>
  );

  return (
    <Dialog
      header="📊 สรุปคะแนนรวมทุกเกม"
      visible={visible}
      onHide={onHide}
      footer={footer}
      style={{ width: "90vw", maxWidth: "1200px" }}
      breakpoints={{ "960px": "95vw", "640px": "100vw" }}
      modal
      draggable={false}
      className="bg-gray-900"
    >
      <div className="bg-gray-900 text-white">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <i className="pi pi-spin pi-spinner text-4xl text-blue-400" />
          </div>
        ) : gameHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <i className="pi pi-inbox text-4xl mb-3" />
            <p>ยังไม่มีประวัติเกม</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b-2 border-gray-700">
                    <th className="text-left p-3 text-gray-400">เกม</th>
                    <th className="text-left p-3 text-gray-400">คำตอบ</th>
                    {allPlayers.map((player) => (
                      <th
                        key={player.uuid}
                        className="text-center p-3 text-gray-400"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-semibold">{player.name}</span>
                          <span className="text-2xl font-bold text-yellow-400">
                            {playerScores.find((p) => p.uuid === player.uuid)
                              ?.totalScore || 0}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gameHistory.map((game, index) => (
                    <tr
                      key={game.id}
                      className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="p-3 font-semibold text-gray-300">
                        เกม {index + 1}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">
                            {game.word}
                          </span>
                          <div className="flex gap-2 mt-1">
                            {game.voteResult && (
                              <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">
                                🗳️ โหวต: {game.voteResult.mostVotedCount}
                              </span>
                            )}
                            {game.gameOutcome && (
                              <span className="text-xs bg-purple-600 px-2 py-0.5 rounded">
                                {game.gameOutcome}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      {allPlayers.map((player) => {
                        const role = get(game.roles, player.uuid);
                        const score = get(game.scores, player.uuid, 0);
                        return (
                          <td key={player.uuid} className="p-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              {role && (
                                <i
                                  className={`pi ${getRoleIcon(
                                    role
                                  )} text-2xl ${getRoleColor(role)}`}
                                />
                              )}
                              {score > 0 ? (
                                <span className="text-lg font-bold text-yellow-400">
                                  +{score}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-500">0</span>
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
              {gameHistory.map((game, index) => (
                <div
                  key={game.id}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold">เกม {index + 1}</h3>
                    <span className="text-yellow-400 font-bold">
                      {game.word}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {allPlayers.map((player) => {
                      const role = get(game.roles, player.uuid);
                      const score = get(game.scores, player.uuid, 0);
                      return (
                        <div
                          key={player.uuid}
                          className="flex justify-between items-center p-2 bg-gray-700/50 rounded"
                        >
                          <div className="flex items-center gap-2">
                            {role && (
                              <i
                                className={`pi ${getRoleIcon(
                                  role
                                )} ${getRoleColor(role)}`}
                              />
                            )}
                            <span>{player.name}</span>
                          </div>
                          <span className="text-yellow-400 font-bold">
                            {score > 0 ? `+${score}` : "0"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};
