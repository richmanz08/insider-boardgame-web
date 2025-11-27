import { PlayerData } from "@/src/hooks/interface";

export const useRoomHook = () => {
  // Your hook logic here

  function checkShowModalCountdownStart(players: PlayerData[]) {
    const allPlayersReady = players.every((p) => p.ready);
    return allPlayersReady;
  }

  return {
    checkShowModalCountdownStart,
  };
};
