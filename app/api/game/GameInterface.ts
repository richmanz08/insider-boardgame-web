import { RoleGame, PlayerInGame } from "@/src/hooks/interface";

export interface GameData {
  id: string;
  roomCode: string;
  word: string;
  roles: RoleGame; // playerUuid -> role (MASTER/INSIDER/PLAYER)
  startedAt: string;
  endsAt: string;
  durationSeconds: number;
  finished: boolean;
  // cardOpened: boolean;
}

/**
 * DTO for vote results summary
 */
export interface VoteResultDto {
  insiderUuid: string;
  mostVotedUuid: string;
  mostVotedCount: number;
  voteTally: Record<string, number>; // targetUuid -> vote count
}

/**
 * DTO for displaying game history
 * Contains all game information including roles, scores, and results
 */
export interface GameHistoryData {
  id: string;
  roomCode: string;
  word: string;
  wordRevealed: boolean;
  startedAt: string; // ISO date string
  endsAt: string; // ISO date string
  durationSeconds: number;
  finished: boolean;

  // Players in this game
  players: PlayerInGame[];

  // Roles assigned to each player (uuid -> role)
  roles: Record<string, RoleGame>;

  // Card opened status (uuid -> opened)
  cardOpened: Record<string, boolean>;

  // Votes (voterUuid -> targetUuid)
  votes: Record<string, string>;

  // Scores (uuid -> score)
  scores: Record<string, number>;

  // Vote results summary
  voteResult: VoteResultDto;

  // Game outcome: "INSIDER_FOUND", "INSIDER_HIDDEN", "MASTER_WIN", etc.
  gameOutcome: string;
}
