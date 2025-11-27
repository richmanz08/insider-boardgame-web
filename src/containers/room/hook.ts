import { RoomStatus } from "@/app/api/room/RoomInterface";
import { MINIMUM_PLAYERS } from "@/src/config/system";
import { PlayerData } from "@/src/hooks/interface";

export const useRoomHook = () => {
  // Your hook logic here

  function checkShowModalCountdownStart(players: PlayerData[]) {
    const allPlayersReady = players.every((p) => p.ready);
    return allPlayersReady && players.length >= MINIMUM_PLAYERS;
  }

  function getStatusLabel(status: RoomStatus) {
    switch (status) {
      case RoomStatus.WAITING:
        return "รอผู้เล่น";
      case RoomStatus.READY:
        return "พร้อมเริ่ม";
      case RoomStatus.PLAYING:
        return "กำลังเล่น";
      case RoomStatus.FINISHED:
        return "จบเกม";
      default:
        return status;
    }
  }

  function getStatusSeverity(status: RoomStatus) {
    switch (status) {
      case RoomStatus.WAITING:
        return "info";
      case RoomStatus.READY:
        return "success";
      case RoomStatus.PLAYING:
        return "warning";
      case RoomStatus.FINISHED:
        return "secondary";
      default:
        return "info";
    }
  }

  return {
    checkShowModalCountdownStart,
    getStatusLabel,
    getStatusSeverity,
  };
};
