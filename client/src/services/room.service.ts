import apiLatest from "../config/api";
import { GameRoom } from "../types/room.type";

export type AuthForm = {
  username: string;
  password: string;
};

const getAllRooms = async () =>
  apiLatest.get<GameRoom[]>(`/gamerooms`).then((res) => res.data);

export { getAllRooms };
