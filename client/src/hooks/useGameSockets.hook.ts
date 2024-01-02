import { useEffect, useState } from "react";
import { socket } from "../socket";
import { User } from "../types/user.type";
import {
  SocketCallback,
  UseStartGameSocketProps,
  GameSigns,
} from "../types/socket.type";
import {
  GAME_EVENTS,
  APP_EVENTS,
  LOBBY_EVENTS,
} from "../../../shared/socketEvents";

type UseGameSocketsProps = {
  userDetails: User;
};

export type GameStateType = {
  isConnected: boolean;
  isInLobby: boolean;
  isGameActive: boolean;
  isMyTurn: boolean;
  showResult: boolean;
};

const defaultArray = Array(9).fill(null);

const useGameSockets = ({ userDetails }: UseGameSocketsProps) => {
  const [gameState, setGameState] = useState<GameStateType>({
    isConnected: false,
    isInLobby: false,
    isGameActive: false,
    isMyTurn: false,
    showResult: false,
  });

  const [currentSign, setCurrentSign] = useState<GameSigns | null>();
  const [board, setBoard] = useState<(string | null)[]>(defaultArray);
  const [oppositePlayer, setOppositePlayer] = useState<User | null>(null);
  const [lobbySize, setLobbySize] = useState(0);
  const [lastWin, setLastWin] = useState<string | null>(null);

  const connect = () => {
    socket.connect();
  };

  const disconnect = () => {
    socket.disconnect();
  };

  const onLobbyStatusChangeSucces =
    (isInLobby: boolean): SocketCallback =>
    ({ status }) => {
      if (status === "ok") {
        setLastWin(null);

        setGameState((oldVal) => ({
          ...oldVal,
          isInLobby: isInLobby,
          showResult: false,
        }));
      }
    };

  const joinLobby = () => {
    resetArray();

    socket.emit(LOBBY_EVENTS.join, onLobbyStatusChangeSucces(true));
  };

  const leaveLobby = () => {
    socket.emit(LOBBY_EVENTS.leave, onLobbyStatusChangeSucces(false));
  };

  const onMoveSuccess: SocketCallback = ({ status }) => {
    if (status === "ok") {
      setGameState((oldVal) => ({ ...oldVal, isMyTurn: false }));
    }
  };

  const makeMove = (tileId: string) => {
    socket.emit(GAME_EVENTS.move, tileId, onMoveSuccess);
  };

  const resetArray = () => setBoard(defaultArray);

  useEffect(() => {
    const onConnect = () => {
      setGameState((oldVal) => ({ ...oldVal, isConnected: true }));
    };

    const onHello = () => {
      console.log("! HELLO EVENT");
    };

    const onYourTurn = () => {
      setGameState((oldVal) => ({ ...oldVal, isMyTurn: true }));
    };

    const gameEnd = (winner: string) => {
      console.log("GAME END, WINNER", winner);
      setGameState((oldVal) => ({
        ...oldVal,
        isGameActive: false,
        showResult: true,
      }));
      setLastWin(winner);
    };

    const onGameStart = (players: UseStartGameSocketProps) => {
      resetArray();
      setCurrentSign(players[userDetails._id].sign);

      const idOfOpposite = Object.keys(players).filter(
        (x) => x !== userDetails._id
      )[0];
      idOfOpposite && setOppositePlayer(players[idOfOpposite].user);

      setGameState((oldVal) => ({
        ...oldVal,
        isInLobby: false,
        isGameActive: true,
      }));
    };

    const onUpdateBoard = (newBoard: typeof board) => {
      setBoard(newBoard);
    };

    const onLobbySizeUpdate = (size: number) => setLobbySize(size);

    socket.on(APP_EVENTS.connect, onConnect);
    socket.on(APP_EVENTS.hello, onHello);
    socket.on(GAME_EVENTS.start, onGameStart);
    socket.on(GAME_EVENTS.yourTurn, onYourTurn);
    socket.on(GAME_EVENTS.updateBoard, onUpdateBoard);
    socket.on(GAME_EVENTS.end, gameEnd);
    socket.on(LOBBY_EVENTS.playersAmount, onLobbySizeUpdate);
    connect();

    return () => {
      socket.off(APP_EVENTS.connect, onConnect);
      socket.off(APP_EVENTS.hello, onHello);
      socket.off(GAME_EVENTS.start, onGameStart);
      socket.off(GAME_EVENTS.yourTurn, onYourTurn);
      socket.off(GAME_EVENTS.updateBoard, onUpdateBoard);
      socket.off(GAME_EVENTS.end, gameEnd);
      socket.off(LOBBY_EVENTS.playersAmount, onLobbySizeUpdate);

      disconnect();
    };
  }, []);

  return {
    connect,
    disconnect,
    joinLobby,
    leaveLobby,
    makeMove,
    gameState,
    board,
    currentSign,
    oppositePlayer,
    lobbySize,
    lastWin,
  };
};

export { useGameSockets };
