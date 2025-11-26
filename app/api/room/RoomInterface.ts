export interface CreateRoomRequest {
  roomName: string;
  maxPlayers: number;
  password?: string;
  hostUuid: string;
  hostName: string;
}

export interface RoomData {
  id: number;
  roomCode: string;
  roomName: string;
  maxPlayers: number;
  currentPlayers: number;
  hasPassword: boolean;
  status: string;
  hostUuid: string;
  hostName: string;
  createdAt: string;
}
