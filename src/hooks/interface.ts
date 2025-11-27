export interface RoomUpdateMessage {
  type: RoomUpdateMessageType; // "PLAYER_JOINED", "PLAYER_LEFT", "PLAYER_READY", "ROOM_UPDATE"
  roomCode: string;
  roomName: string;
  maxPlayers: number;
  currentPlayers: number;
  status: string;
  players: PlayerData[];
  message: string;
}

export enum RoomUpdateMessageType {
  PLAYER_JOINED = "PLAYER_JOINED",
  PLAYER_LEFT = "PLAYER_LEFT",
  PLAYER_READY = "PLAYER_READY",
  ROOM_UPDATE = "ROOM_UPDATE",
  GAME_STARTED = "GAME_STARTED",
  GAME_FINISHED = "GAME_FINISHED",
}

export interface PlayerData {
  uuid: string;
  playerName: string;
  host: boolean;
  ready: boolean;
  joinedAt: string;
  active: boolean;
  lastActiveAt: string;
}

export interface GamePrivateMessage {
  playerUuid: string;
  role: RoleGame;
  word: string | null; // null for CITIZEN
}
export enum RoleGame {
  MASTER = "MASTER",
  INSIDER = "INSIDER",
  CITIZEN = "CITIZEN",
}

export interface StartGameRequest {
  triggerByUuid: string;
}
