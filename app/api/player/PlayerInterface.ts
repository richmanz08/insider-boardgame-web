export interface RegisterBody {
  playerName: string;
}

export interface PlayerData {
  uuid: string;
  playerName: string;
  token: string;
  message: string;
}
