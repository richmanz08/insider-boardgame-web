import { PlayerInGame, RoleGame } from "@/src/hooks/interface";

export const usePlayHook = () => {
  function getRoleDisplay(role: RoleGame) {
    switch (role) {
      case RoleGame.INSIDER:
        return {
          name: "Insider",
          color: "text-red-500",
          bgColor: "from-red-600 to-red-800",
          icon: "pi-eye !text-gray-300",
          description: "บงการผู้เล่นไปสู่คำตอบโดยไม่ให้ถูกจับได้",
        };
      case RoleGame.MASTER:
        return {
          name: "Master",
          color: "text-purple-500",
          bgColor: "from-purple-600 to-purple-800",
          icon: "pi-crown !text-gray-300",
          description: "ให้คำใบ้โดยไม่เปิดเผยคำตอบโดยตรง",
        };
      case RoleGame.CITIZEN:
        return {
          name: "Player",
          color: "text-blue-500",
          bgColor: "from-blue-600 to-blue-800",
          icon: "pi-user !text-gray-300",
          description: "ถามคำถามเพื่อหาคำตอบ",
        };
    }
  }
  function countVotes(votes: Record<string, string>) {
    const voteCount: Record<string, number> = {};
    Object.values(votes).forEach((targetPlayerUuid) => {
      if (voteCount[targetPlayerUuid]) {
        voteCount[targetPlayerUuid] += 1;
      } else {
        voteCount[targetPlayerUuid] = 1;
      }
    });
    return voteCount;
  }
  function findWhoIsVoteMe(
    votes: Record<string, string>,
    myUuid: string,
    players: PlayerInGame[]
  ): PlayerInGame[] {
    const voters: PlayerInGame[] = [];
    Object.entries(votes).forEach(([playerUuid, targetPlayerUuid]) => {
      if (targetPlayerUuid === myUuid) {
        const player = players.find((p) => p.uuid === playerUuid);
        if (player) {
          voters.push(player);
        }
      }
    });
    return voters;
  }
  function allPlayersVoted(
    votes: Record<string, string>,
    players: PlayerInGame[]
  ): boolean {
    return Object.keys(votes).length === players.length;
  }

  function sortPlayersByVotes(
    players: PlayerInGame[],
    voteTally: Record<string, number>
  ): string[] {
    return players
      .slice()
      .sort((a, b) => {
        const votesA = voteTally[a.uuid] || 0;
        const votesB = voteTally[b.uuid] || 0;
        return votesB - votesA; // เรียงจากมากไปน้อย
      })
      .map((player) => player.uuid);
  }
  return {
    getRoleDisplay,
    countVotes,
    findWhoIsVoteMe,
    allPlayersVoted,
    sortPlayersByVotes,
  };
};
