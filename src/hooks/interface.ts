export interface RoomUpdateMessage {
  type: RoomUpdateMessageType; // "PLAYER_JOINED", "PLAYER_LEFT", "PLAYER_READY", "ROOM_UPDATE"
  roomCode: string;
  roomName: string;
  maxPlayers: number;
  currentPlayers: number;
  status: string;
  players: PlayerData[];
  message: string;
  activeGame: GameSummaryDto | null;
}
export interface GameSummaryDto {
  id: string;
  word: string; // usually not included in broadcast, but can be null
  startedAt: string; // ISO string
  endsAt: string; // ISO string
  durationSeconds: number;
  finished: boolean;
}

export enum RoomUpdateMessageType {
  PLAYER_JOINED = "PLAYER_JOINED",
  PLAYER_LEFT = "PLAYER_LEFT",
  PLAYER_READY = "PLAYER_READY",
  ROOM_UPDATE = "ROOM_UPDATE",
  GAME_STARTED = "GAME_STARTED",
  GAME_FINISHED = "GAME_FINISHED",
  CARD_OPENED = "CARD_OPENED",
  VOTE_STARTED = "VOTE_STARTED",
  VOTE_CAST = "VOTE_CAST",
}

export interface PlayerData {
  uuid: string;
  playerName: string;
  host: boolean;
  ready: boolean;
  playing: boolean;
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

export interface ActiveGame {
  id?: string | null; // UUID string
  roomCode: string;
  roles: Record<string, RoleGame>; // playerUuid -> role name
  startedAt?: string | null; // ISO string (server LocalDateTime.toString())
  endsAt?: string | null; // ISO string
  durationSeconds: number;
  finished: boolean;
  cardOpened: Record<string, boolean>;
  privateMessage: GamePrivateMessage | null;
  votes: Record<string, string>; // playerUuid -> targetPlayerUuid
  playerInGame: PlayerInGame[];
  summary: Summary | null;
  word: string;
  wordRevealed: boolean;
}

export interface Summary {
  scores: Record<string, number>;
  voteTally: Record<string, number>;
  mostVoted: string[];
  insiderCaught: boolean; // INSIDER ถูกจับได้
  citizensAnsweredCorrectly: boolean; // CITIZENs ตอบถูก
  insiderUuid: string;
  masterUuid: string;
  word: string;
}
export interface PlayerInGame {
  uuid: string;
  playerName: string;
}
