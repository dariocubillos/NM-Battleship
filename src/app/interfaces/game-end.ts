import { GameStatus } from "../enums/game-status.enum";

export interface GameEnd {
  id: number;
  result: GameStatus;
  remainingTurns: number;
  date: string;
}
