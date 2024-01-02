import { Socket } from "socket.io";

export type LobbyItem = {
  socket: Socket;
  userId: string;
  score: number;
};

//Could be a class also :) 
const LobbyFactory = () => {
  let gameLobby: LobbyItem[] = [];

  const addToLobby = (item: LobbyItem) => {
    gameLobby.push(item);
    gameLobby = gameLobby.sort((a, b) => b.score - a.score);
  };

  const isUserInLobby = (userId: string) =>
    gameLobby.some((x) => x.userId === userId);

  const getFirstTwoUsers = () => [gameLobby.shift(), gameLobby.shift()];

  const removeFromLobby = (userId: string) => {
    gameLobby = gameLobby.filter((x) => x.userId !== userId);
  };

  const getLobbySize = () => gameLobby.length;

  return {
    addToLobby,
    isUserInLobby,
    getFirstTwoUsers,
    removeFromLobby,
    getLobbySize,
  };
};

export const gameLobby = LobbyFactory();
