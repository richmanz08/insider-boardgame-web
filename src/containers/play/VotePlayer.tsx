"use client";
import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { RoleGame } from "@/src/hooks/interface";
import { usePlayHook } from "./hook";

interface Player {
  id: string;
  name: string;
  isHost: boolean;
  avatar?: string;
  votes: number; // จำนวนโหวตที่ได้รับ
  role?: RoleGame; // จะถูกเปิดเผยในตอนท้าย
}

interface VotePlayerProps {
  roomId?: string;
  myPlayerId: string;
  myRole: RoleGame;
  onVoteComplete: (votedPlayerId: string) => void;
  onNavigateToEndgame: () => void; // Callback เมื่อต้องการไปหน้าสรุปผล
}

export const VotePlayer: React.FC<VotePlayerProps> = ({
  roomId,
  myPlayerId,
  myRole,
  onVoteComplete,
  onNavigateToEndgame,
}) => {
  console.log("Room ID:", roomId); // TODO: ใช้ดึงข้อมูลจาก API
  const { getRoleDisplay } = usePlayHook();
  // Mock players data
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "PlayerOne", isHost: false, votes: 0 },
    { id: "2", name: "You", isHost: true, votes: 0 },
    { id: "3", name: "GameMaster", isHost: false, votes: 0 },
    { id: "4", name: "Newbie", isHost: false, votes: 0 },
  ]);
  const [myVote, setMyVote] = useState<string | null>(null);
  const [allVoted, setAllVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [revealedPlayers, setRevealedPlayers] = useState<string[]>([]);
  const [autoNavigateIn, setAutoNavigateIn] = useState<number | null>(null);

  // Mock: จำลองการโหวตของผู้เล่นคนอื่น
  useEffect(() => {
    if (myVote) {
      // TODO: ส่งโหวตไปยัง WebSocket
      console.log(`Voted for player ${myVote}`);

      // Mock: สมมติว่าผู้เล่นคนอื่นโหวตเสร็จหมดแล้วหลัง 3 วินาที
      const timer = setTimeout(() => {
        // Mock: กระจายโหวตแบบสุ่ม
        const updatedPlayers = players.map((p) => ({
          ...p,
          votes: Math.floor(Math.random() * 3), // Random 0-2 votes
          role:
            p.id === "1"
              ? RoleGame.INSIDER
              : p.id === "2"
              ? RoleGame.MASTER
              : RoleGame.CITIZEN,
        }));
        setPlayers(updatedPlayers);
        setAllVoted(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [myVote, players]);

  // เมื่อทุกคนโหวตเสร็จ เริ่มแสดงผล
  useEffect(() => {
    if (allVoted && showResults === false) {
      // เรียงจากคนที่โดนโหวตมากสุดไปน้อยสุด
      const sortedPlayers = [...players].sort((a, b) => b.votes - a.votes);

      // รอ 2 วินาทีแล้วเริ่มเปิดการ์ด
      const mainTimer = setTimeout(() => {
        setShowResults(true);

        // เปิดการ์ดทีละคนทุกๆ 2 วินาที
        sortedPlayers.forEach((player, index) => {
          setTimeout(() => {
            setRevealedPlayers((prev) => [...prev, player.id]);
          }, (index + 1) * 2000);
        });
      }, 2000);

      return () => clearTimeout(mainTimer);
    }
  }, [allVoted, players, showResults]);

  // Auto-navigate หลังจากเปิดการ์ดครบทั้งหมดแล้ว 7 วินาที
  useEffect(() => {
    if (
      showResults &&
      revealedPlayers.length === players.length &&
      autoNavigateIn === null
    ) {
      // เริ่มนับถอยหลัง และ navigate
      let countdown = 7;

      const countdownInterval = setInterval(() => {
        countdown -= 1;
        setAutoNavigateIn(countdown);

        if (countdown <= 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);

      // Callback ไปหน้าสรุปผลหลัง 7 วินาที
      const navigateTimer = setTimeout(() => {
        if (onNavigateToEndgame) {
          onNavigateToEndgame();
        }
      }, 7000);

      // ตั้งค่าเริ่มต้น
      setTimeout(() => {
        setAutoNavigateIn(7);
      }, 0);

      return () => {
        clearInterval(countdownInterval);
        clearTimeout(navigateTimer);
      };
    }
  }, [
    showResults,
    revealedPlayers.length,
    players.length,
    autoNavigateIn,
    onNavigateToEndgame,
  ]);

  const handleVote = (playerId: string) => {
    if (myRole === RoleGame.MASTER) {
      return; // Master ไม่สามารถโหวตได้
    }

    if (playerId === myPlayerId) {
      return; // ไม่สามารถโหวตตัวเองได้
    }

    setMyVote(playerId);
    onVoteComplete(playerId);
  };

  const isMaster = myRole === RoleGame.MASTER;
  const canVote = !isMaster && !myVote;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="container mx-auto max-w-6xl pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-red-400 to-orange-600 bg-clip-text text-transparent">
            {!allVoted ? "ใครคือ Insider?" : "กำลังเปิดเผยบทบาท..."}
          </h1>
          {!allVoted && (
            <p className="text-gray-400 text-lg">
              {isMaster
                ? "คุณเป็น Master ไม่สามารถโหวตได้"
                : myVote
                ? "รอผู้เล่นคนอื่นโหวต..."
                : "เลือกผู้เล่นที่คุณคิดว่าเป็น Insider"}
            </p>
          )}
        </div>

        {/* Master Notice */}
        {isMaster && !allVoted && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4 text-center">
              <i className="pi pi-crown text-purple-400 text-2xl mb-2" />
              <p className="text-purple-300 font-semibold">
                คุณเป็น Master และไม่สามารถโหวตได้
              </p>
              <p className="text-purple-400 text-sm mt-1">
                รอผู้เล่นคนอื่นเลือก Insider
              </p>
            </div>
          </div>
        )}

        {/* My Vote Status */}
        {myVote && !allVoted && !isMaster && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-center">
              <i className="pi pi-check-circle text-green-400 text-2xl mb-2" />
              <p className="text-green-300 font-semibold">
                คุณโหวตให้ {players.find((p) => p.id === myVote)?.name} แล้ว
              </p>
              <div className="mt-3">
                <i className="pi pi-spin pi-spinner text-green-400" />
                <p className="text-green-400 text-sm mt-1">
                  รอผู้เล่นคนอื่น...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Players Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {players.map((player) => {
            const isRevealed = revealedPlayers.includes(player.id);
            const isMyVote = myVote === player.id;
            const isMe = player.id === myPlayerId;

            return (
              <div key={player.id} className="relative">
                {/* Vote Count Badge */}
                {allVoted && (
                  <div className="absolute -top-2 -right-2 z-10 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg">
                    {player.votes}
                  </div>
                )}

                <Card
                  className={`relative transition-all duration-300 cursor-pointer ${
                    isRevealed
                      ? `bg-gradient-to-br ${
                          getRoleDisplay(player.role!).bgColor
                        } border-2`
                      : isMyVote
                      ? "bg-green-800 border-2 border-green-500 scale-105"
                      : isMe
                      ? "bg-gray-700 border-2 border-gray-500"
                      : canVote
                      ? "bg-gray-800 border-2 border-gray-600 hover:border-red-500 hover:scale-105"
                      : "bg-gray-800 border-2 border-gray-600 opacity-60"
                  }`}
                  onClick={() => !isRevealed && handleVote(player.id)}
                >
                  <div className="p-4">
                    {!isRevealed ? (
                      <>
                        {/* Avatar */}
                        <div className="flex justify-center mb-3">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                        </div>

                        {/* Player Name */}
                        <h3 className="text-center text-lg font-bold text-white mb-2">
                          {player.name}
                        </h3>

                        {/* Status Badges */}
                        <div className="flex flex-col gap-1">
                          {isMe && (
                            <div className="text-center">
                              <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                                คุณ
                              </span>
                            </div>
                          )}
                          {isMyVote && (
                            <div className="text-center">
                              <span className="text-xs bg-green-600 px-2 py-1 rounded">
                                ✓ โหวตแล้ว
                              </span>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Revealed Role */}
                        <div className="flex flex-col items-center animate-fade-in">
                          <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-3">
                            <i
                              className={`pi ${
                                getRoleDisplay(player.role!).icon
                              } text-white text-3xl`}
                            />
                          </div>
                          <h3 className="text-white text-lg font-bold mb-1">
                            {player.name}
                          </h3>
                          <p
                            className={`text-2xl font-bold ${
                              getRoleDisplay(player.role!).color
                            }`}
                          >
                            {getRoleDisplay(player.role!).name}
                          </p>
                          <p className="text-white text-sm mt-2">
                            {player.votes} โหวต
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Instructions */}
        {!allVoted && (
          <div className="text-center">
            <div className="inline-block bg-yellow-900/30 border border-yellow-700 rounded-lg px-6 py-3">
              <p className="text-yellow-400 text-sm">
                <i className="pi pi-info-circle mr-2" />
                {canVote
                  ? "คลิกที่ผู้เล่นที่คุณคิดว่าเป็น Insider"
                  : isMaster
                  ? "Master ไม่สามารถโหวตได้"
                  : "รอผู้เล่นคนอื่นโหวต..."}
              </p>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {showResults && revealedPlayers.length === players.length && (
          <div className="mt-8 text-center animate-fade-in">
            <Card className="max-w-2xl mx-auto bg-gray-800 border-2 border-gray-700">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  ผลการโหวต
                </h2>
                {players.find((p) => p.role === RoleGame.INSIDER) && (
                  <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-4">
                    <p className="text-red-300 text-lg font-semibold">
                      <i className="pi pi-eye mr-2" />
                      Insider คือ:{" "}
                      {players.find((p) => p.role === RoleGame.INSIDER)?.name}
                    </p>
                  </div>
                )}

                {/* Auto-navigate countdown */}
                {autoNavigateIn !== null && autoNavigateIn > 0 && (
                  <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 mb-4">
                    <p className="text-blue-300 text-sm">
                      <i className="pi pi-clock mr-2" />
                      จะไปหน้าสรุปผลอัตโนมัติใน{" "}
                      <span className="font-bold text-lg">
                        {autoNavigateIn}
                      </span>{" "}
                      วินาที
                    </p>
                  </div>
                )}

                <Button
                  label="ไปหน้าสรุปผลทันที"
                  icon="pi pi-arrow-right"
                  size="large"
                  onClick={() => {
                    if (onNavigateToEndgame) {
                      onNavigateToEndgame();
                    }
                  }}
                />
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
