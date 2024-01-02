import { User } from "./user.type";

export type GameRoom = {
  player1: User;
  player2: User;
  createdAt: Date;
  endedAt: Date;
  isActive: boolean;
  lastMove: string;
  board: string[][];
};
