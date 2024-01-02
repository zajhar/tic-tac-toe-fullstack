import { User } from "./user.type";

export type SocketCallback = ({ status }: { status: "ok" | "error" }) => void;

export enum GameSigns {
  X = "X",
  O = "O",
}

export type UseStartGameSocketProps = {
  [key: string]: {
    user: User;
    sign: GameSigns;
  };
};
