export interface CreateRoomRequest {
  roomName: string;
  maxPlayers: number;
  password?: string;
  hostUuid: string;
  hostName: string;
}

export interface RoomData {
  roomCode: string;
  roomName: string;
  maxPlayers: number;
  currentPlayers: number;
  hasPassword: boolean;
  status: RoomStatus;
  hostUuid: string;
  hostName: string;
  createdAt: string;
}

export enum RoomStatus {
  WAITING = "WAITING",
  PLAYING = "PLAYING",
}

export interface JoinRoomRequest {
  roomCode: string;
  password?: string;
  playerUuid: string;
  playerName: string;
}

export interface LeaveRoomRequest {
  roomCode: string;
  playerUuid: string;
}
