/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useLayoutEffect, useContext } from "react";
import { Card } from "primereact/card";
import { ActiveGame, RoleGame } from "@/src/hooks/interface";
import { usePlayHook } from "../play/hook";
import { isEmpty, map } from "lodash";
import { Avatar } from "@/src/components/avatar/Avatar";
import { Button } from "primereact/button";
import { RoomContext } from "../room/Room";

interface VotePlayerProps {
  activeGame: ActiveGame;
  onMyVote: (playerUuid: string) => void;
  onHostSummary: () => void;
  onVoteFinished: () => void;
}

export const VotePlayer: React.FC<VotePlayerProps> = ({
  activeGame,
  onMyVote,
  onHostSummary,
  onVoteFinished,
}) => {
  const {
    getRoleDisplay,
    countVotes,
    findWhoIsVoteMe,
    allPlayersVoted,
    sortPlayersByVotes,
  } = usePlayHook();

  const { isHost, onRevealingRole } = useContext(RoomContext);

  const [myVote, setMyVote] = useState<string | null>(null);

  const [revealedPlayers, setRevealedPlayers] = useState<string[]>([]);
  const [uuidsVoted, setUuidsVoted] = useState<Record<string, number>>({});
  const [voteFinished, setVoteFinished] = useState(false);

  const myUuid = activeGame.privateMessage?.playerUuid || "";
  const players = activeGame.playerInGame;

  useLayoutEffect(() => {
    if (isEmpty(activeGame.votes)) return;
    const vote = activeGame.votes[myUuid];
    if (vote) {
      setMyVote(vote);
    }
    setUuidsVoted(countVotes(activeGame.votes));
    setVoteFinished(allPlayersVoted(activeGame.votes, players));
  }, [activeGame.votes, myUuid]);

  useLayoutEffect(() => {
    if (!activeGame.summary) return;
    const sortedUuids = sortPlayersByVotes(
      players,
      activeGame.summary.voteTally
    );
    const voteTally = activeGame.summary.voteTally;

    // แยก uuid ที่ถูกโหวต (vote > 0) กับที่เหลือ
    const votedUuids = sortedUuids.filter(
      (uuid) => voteTally[uuid] && voteTally[uuid] > 0
    );
    const unvotedUuids = sortedUuids.filter(
      (uuid) => !voteTally[uuid] || voteTally[uuid] === 0
    );

    setRevealedPlayers([]); // reset ก่อน
    onRevealingRole(true);
    // เปิดทีละคน (delay 1.5s ต่อคน)
    votedUuids.forEach((uuid, idx) => {
      setTimeout(() => {
        setRevealedPlayers((prev) => [...prev, uuid]);
      }, idx * 1500);
    });

    // เปิดคนที่เหลือพร้อมกันหลังจากเปิดคนที่ถูกโหวตครบ
    if (unvotedUuids.length > 0) {
      setTimeout(() => {
        setRevealedPlayers((prev) => [...prev, ...unvotedUuids]);

        setTimeout(() => {
          onVoteFinished();
        }, 3000);
      }, votedUuids.length * 1500 + 500); // เปิดพร้อมกันหลัง delay สุดท้าย
    }
  }, [activeGame.summary, players, onVoteFinished]);

  const handleVote = (playerId: string) => {
    if (activeGame.summary) return;
    if (playerId === myUuid) {
      return; // ไม่สามารถโหวตตัวเองได้
    }

    setMyVote(playerId);
    onMyVote(playerId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="container mx-auto max-w-6xl pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-red-400 to-orange-600 bg-clip-text text-transparent">
            {!voteFinished ? "ใครคือ Insider?" : "กำลังเปิดเผยบทบาท..."}
          </h1>
          {!voteFinished && (
            <p className="text-gray-400 text-lg">
              {myVote
                ? "รอผู้เล่นคนอื่นโหวต..."
                : "เลือกผู้เล่นที่คุณคิดว่าเป็น Insider"}
            </p>
          )}
          {isHost && !activeGame.summary && (
            <Button
              disabled={!voteFinished}
              className="mt-4"
              onClick={onHostSummary}
              label="สรุปผลโดยโฮสต์"
            />
          )}
        </div>

        {/* My Vote Status */}
        {myVote && !voteFinished && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-center">
              <i className="pi pi-check-circle text-green-400 text-2xl mb-2" />
              <p className="text-green-300 font-semibold">
                คุณโหวตให้ {players.find((p) => p.uuid === myVote)?.playerName}{" "}
                แล้ว
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
            const isRevealed = revealedPlayers.includes(player.uuid);
            const isMyVote = myVote === player.uuid;
            const isMe = player.uuid === myUuid;
            const thisPlayerWasVote = uuidsVoted[player.uuid] ?? 0;
            const myRoleIs = activeGame.roles[player.uuid];
            const whoIsVoteMe = findWhoIsVoteMe(
              activeGame.votes,
              player.uuid,
              players
            );

            return (
              <div key={player.uuid} className="relative">
                {/* Vote Count Badge */}
                {thisPlayerWasVote > 0 && (
                  <div className="absolute -top-2 -right-2 z-10 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg">
                    {thisPlayerWasVote}
                  </div>
                )}

                <Card
                  className={`relative transition-all duration-300 cursor-pointer ${
                    isRevealed
                      ? `bg-gradient-to-br ${
                          getRoleDisplay(RoleGame.INSIDER).bgColor
                        } border-2`
                      : isMyVote
                      ? "bg-green-800 border-2 border-green-500 scale-105"
                      : isMe
                      ? "bg-gray-700 border-2 border-gray-500 !cursor-default"
                      : // : canVote
                        // ? "bg-gray-800 border-2 border-gray-600 hover:border-red-500 hover:scale-105"
                        "bg-gray-800 border-2 border-gray-600 opacity-60"
                  }`}
                  onClick={() =>
                    !isRevealed && !isMe && handleVote(player.uuid)
                  }
                >
                  <div className="p-4">
                    {!isRevealed ? (
                      <div className="flex flex-col items-center">
                        <Avatar
                          name={player.playerName ?? "UNKNOW_NAME"}
                          size="lg"
                        />

                        {/* Player Name */}
                        <div className="flex items-center flex-nowrap gap-2">
                          <h3 className="text-center text-lg font-bold text-white">
                            {player.playerName}
                          </h3>
                          {isMe && (
                            <div className="text-center">
                              <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                                คุณ
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-col gap-1">
                          {isMyVote && (
                            <div className="text-center">
                              <span className="text-xs bg-green-600 px-2 py-1 rounded">
                                ✓ โหวตแล้ว
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Revealed Role */}
                        <div className="flex flex-col items-center animate-fade-in">
                          <div className="w-16 h-16 rounded-full border border-white flex items-center justify-center mb-3">
                            <i
                              className={`pi ${
                                getRoleDisplay(myRoleIs).icon
                              } text-white text-3xl`}
                            />
                          </div>
                          <h3 className="text-white text-lg font-bold mb-1">
                            {player.playerName}
                          </h3>
                          <p
                            className={`text-2xl font-bold ${
                              getRoleDisplay(myRoleIs).color
                            }`}
                          >
                            {getRoleDisplay(myRoleIs).name}
                          </p>
                          <p className="text-white text-sm mt-2">{2} โหวต</p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex w-full justify-center opacity-45">
                    {map(whoIsVoteMe, (voter) => (
                      <Avatar
                        key={voter.uuid}
                        name={voter.playerName ?? "UNKNOWN_NAME"}
                        size="sm"
                      />
                    ))}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
