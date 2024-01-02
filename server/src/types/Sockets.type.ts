export enum GameSigns {
  X = "X",
  O = "O",
}

export interface SocketData {
  roomId: string;
  playerSign: GameSigns;
}
