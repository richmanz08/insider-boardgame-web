import { RoleGame } from "@/src/hooks/interface";

export interface GameData {
  id: string;
  roomCode: string;
  word: string;
  roles: RoleGame; // playerUuid -> role (MASTER/INSIDER/PLAYER)
  startedAt: string;
  endsAt: string;
  durationSeconds: number;
  finished: boolean;
}
