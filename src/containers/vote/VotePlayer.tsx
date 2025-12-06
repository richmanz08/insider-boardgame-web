/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useLayoutEffect, useContext, useEffect } from "react";
import { Card } from "primereact/card";
import { ActiveGame, PlayerInGame, RoleGame } from "@/src/hooks/interface";
import { usePlayHook } from "../play/hook";
import { filter, isEmpty, map } from "lodash";
import { Avatar } from "@/src/components/avatar/Avatar";
import { RoomContext } from "../room/Room";
import { Typography } from "@/src/components/text/Typography";
import { Tag } from "primereact/tag";
import { Button } from "@/src/components/button/Button";

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
  const [masterPlayer, setMasterPlayer] = useState<PlayerInGame | null>(null);

  const myUuid = activeGame.privateMessage?.playerUuid || "";
  const players = activeGame.playerInGame;

  useEffect(() => {
    const master = players.find(
      (player) => activeGame.roles[player.uuid] === RoleGame.MASTER
    );
    if (master) {
      setMasterPlayer(master);
    }
  }, [players]);

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

  // const whoIsVoted: string[] = useMemo(() => {
  //   const votedUuids = Object.keys(activeGame.votes);
  //   return votedUuids;
  // }, [activeGame.votes]);

  // console.log({ whoIsVoted });

  const handleVote = (playerId: string) => {
    if (activeGame.summary) return;
    if (playerId === myUuid) {
      return; // ไม่สามารถโหวตตัวเองได้
    }

    setMyVote(playerId);
    onMyVote(playerId);
  };

  return (
    <div className="h-fit bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 my-8 pb-12">
      <div className="container mx-auto max-w-6xl pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          {/* <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-red-400 to-orange-600 bg-clip-text text-transparent">
            {!voteFinished ? "ใครคือ Insider?" : "กำลังเปิดเผยบทบาท..."}
          </h1> */}
          <Typography type="bigheader" className="text-red-500">
            {!voteFinished ? "ใครคือ Insider?" : "กำลังเปิดเผยบทบาท..."}
          </Typography>
          {!voteFinished && (
            <Typography type="body" className="text-gray-400">
              {myVote
                ? "รอผู้เล่นคนอื่นโหวต..."
                : "เลือกผู้เล่นที่คุณคิดว่าเป็น Insider"}
            </Typography>
          )}
        </div>
        {/* Progress indicators */}
        <div className="flex justify-center gap-2 w-full my-12 flex-wrap mb-16">
          {map(players, (player) => {
            const isOpened = activeGame.votes[player.uuid];
            const isMaster = masterPlayer?.uuid === player.uuid;
            return (
              <div
                className={`opacity-${
                  isOpened ? 100 : 60
                } relative border-2 border-${
                  isOpened ? "green" : "gray"
                }-500 rounded-full p-0.5 transition-opacity shadow-lg relative`}
                key={player.uuid}
              >
                <Avatar size="sm" name={player.playerName} />
                {isMaster && (
                  <div className="absolute w-full flex justify-center top-[-60%] ml-[-2px]">
                    <i className="pi pi-crown !text-sm" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* My Vote Status */}
        {/* {myVote && !voteFinished && (
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
        )} */}

        {/* Players Grid */}
        <div className="flex gap-4 mb-8 flex-wrap justify-center">
          {filter(players, function (p) {
            return p.uuid !== masterPlayer?.uuid;
          }).map((player) => {
            const isRevealed = revealedPlayers.includes(player.uuid);
            const isMyVote = myVote === player.uuid;
            const isMe = player.uuid === myUuid;
            const thisPlayerWasVote = uuidsVoted[player.uuid] ?? 0;
            const myRoleIs = activeGame.roles[player.uuid];
            // const whoIsVoteMe = findWhoIsVoteMe(
            //   activeGame.votes,
            //   player.uuid,
            //   players
            // );

            return (
              <div key={player.uuid} className="relative">
                {/* Vote Count Badge */}
                {thisPlayerWasVote > 0 && (
                  <div className="w-full absolute flex justify-center -top-4">
                    <div className="w-6 h-6 z-10 bg-red-600 text-white rounded-full flex items-center justify-center font-semibold text-lg shadow-lg">
                      {thisPlayerWasVote}
                    </div>
                  </div>
                )}

                <Card
                  className={`relative transition-all duration-300 cursor-pointer w-[100px] h-[140px] !p-0 ${
                    isRevealed && myRoleIs === RoleGame.INSIDER
                      ? `bg-gradient-to-br border-2 border-red-500`
                      : isRevealed
                      ? `bg-gradient-to-br border-2 border-gray-500`
                      : isMyVote
                      ? "bg-green-800 border-2 border-green-700 scale-105"
                      : isMe
                      ? "bg-gray-700 border-2 border-gray-700 !cursor-default"
                      : // : canVote
                        // ? "bg-gray-800 border-2 border-gray-600 hover:border-red-500 hover:scale-105"
                        "bg-gray-800 border-2 border-gray-700 opacity-60"
                  }`}
                  onClick={() =>
                    !isRevealed && !isMe && handleVote(player.uuid)
                  }
                  style={{
                    boxShadow:
                      isRevealed && myRoleIs === RoleGame.INSIDER
                        ? "0 20px 40px -10px rgba(239, 68, 68, 0.6), 0 8px 16px -5px rgba(251, 113, 133, 0.4)"
                        : "0 20px 40px -10px rgba(59, 130, 246, 0.6), 0 8px 16px -5px rgba(96, 165, 250, 0.4)",
                  }}
                >
                  <div className="p-4">
                    {!isRevealed ? (
                      <div className="flex flex-col items-center">
                        <Avatar
                          name={player.playerName ?? "UNKNOW_NAME"}
                          size="md"
                        />

                        {/* Player Name */}
                        <div className="flex items-center flex-col">
                          <Typography type="body" maxLines={1} className="mt-3">
                            {player.playerName}
                          </Typography>
                          {isMe && (
                            <div>
                              <Typography
                                type="small"
                                className="text-blue-400 !mt-[-4px]"
                              >
                                (คุณ)
                              </Typography>
                            </div>
                          )}
                        </div>

                        {/* Status Badges */}
                        {/* <div className="flex flex-col gap-1">
                          {isMyVote && (
                            <div className="text-center">
                              <span className="text-xs bg-green-600 px-2 py-1 rounded">
                                ✓ โหวตแล้ว
                              </span>
                            </div>
                          )}
                        </div> */}
                      </div>
                    ) : (
                      <>
                        {/* Revealed Role */}
                        <div
                          className={`flex flex-col items-center animate-fade-in`}
                        >
                          <div
                            className={`w-12 h-12 rounded-full border border-white flex items-center justify-center mb-3 ${
                              isRevealed && myRoleIs === RoleGame.INSIDER
                                ? "bg-red-600 !border-red-600"
                                : ""
                            }`}
                          >
                            <i
                              className={`pi ${getRoleDisplay(myRoleIs).icon} ${
                                isRevealed && myRoleIs === RoleGame.INSIDER
                                  ? ""
                                  : ""
                              } text-white text-2xl`}
                            />
                          </div>
                          <Typography
                            type="body"
                            maxLines={1}
                            className={`${
                              isRevealed && myRoleIs === RoleGame.INSIDER
                                ? "text-red-600 font-bold"
                                : "text-white font-semibold"
                            }`}
                          >
                            {player.playerName}
                          </Typography>
                          {/* <p
                            className={`text-2xl font-bold ${
                              getRoleDisplay(myRoleIs).color
                            }`}
                          >
                            {getRoleDisplay(myRoleIs).name}
                          </p> */}
                          {/* <p className="text-white text-sm mt-2">{2} โหวต</p> */}
                        </div>
                      </>
                    )}
                  </div>
                  {/* <div className="flex w-full justify-center opacity-45">
                    {map(whoIsVoteMe, (voter) => (
                      <Avatar
                        key={voter.uuid}
                        name={voter.playerName ?? "UNKNOWN_NAME"}
                        size="sm"
                      />
                    ))}
                  </div> */}
                </Card>
              </div>
            );
          })}
        </div>

        {isHost && !activeGame.summary && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 z-30">
            <div className="container mx-auto max-w-7xl flex gap-3 justify-center">
              <Button
                disabled={!voteFinished}
                label="เปิดเผยบทบาท"
                // icon="pi pi-refresh"
                size="large"
                severity="warning"
                className="flex-1 md:flex-none"
                onClick={onHostSummary}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
