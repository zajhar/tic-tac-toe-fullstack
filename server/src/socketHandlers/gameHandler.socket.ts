import { Request } from "express";
import GameRoomModel, { GameRoom } from "../models/gameRoom.model";
import UserModel from "../models/user.model";
import {
  calculateWinner,
  type BoardArr,
  returnOpositeSign,
} from "../helpers/game.helper";
import { Server, Socket } from "socket.io";
import { GameSigns } from "../types/Sockets.type";
import { GAME_EVENTS, APP_EVENTS } from "../../../shared/socketEvents";

type SocketCallback = ({ status }: { status: "ok" | "error" }) => void;

interface SocketData {
  roomId: string;
  playerSign: GameSigns;
}

const onEndGame = async (room: GameRoom) => {
  room.isActive = false;
  room.endedAt = new Date();
  await room.save();
};

const increaseWinnerPoints = async (userId: string) => {
  const user = await UserModel.findById(userId).exec();
  if (user) {
    user.points = (user.points || 0) + 5;
    user.save();
  }
};

const gameHandler = async (
  io: Server,
  socket: Socket<any, any, any, SocketData>
) => {
  const request = socket.request as Request;
  const userId = request.session.userId;

  socket.on(
    GAME_EVENTS.move,
    async (tileId: number, callback: SocketCallback) => {
      const { roomId, playerSign } = socket.data;
      const room = await GameRoomModel.findById(roomId);

      if (!room || !room?.isActive) {
        console.log("❌ Room is not valid! ", roomId);
        return;
      }

      if (tileId >= 0 && tileId <= 9 && room?.lastMove !== userId) {
        const boardCopy = room.board[room.board.length - 1] as BoardArr;

        if (boardCopy[tileId] !== null) {
          io.to(socket.id).emit(GAME_EVENTS.error, "Tile is already choosen!");
          console.log("❌ User choose already choosen tile! ", roomId);
          return;
        }
        callback({ status: "ok" });

        boardCopy[tileId] = playerSign;
        room.board = [...room.board, boardCopy];
        room.lastMove = userId;

        io.in(roomId).emit(GAME_EVENTS.updateBoard, boardCopy);
        const isWinner = calculateWinner(boardCopy);

        if (isWinner) {
          onEndGame(room);
          userId && increaseWinnerPoints(userId);
          io.in(roomId).emit(GAME_EVENTS.end, socket.data.playerSign);
          return;
        }

        const anyMovesLeft = boardCopy.some((x) => x === null);

        if (!anyMovesLeft) {
          io.in(roomId).emit(GAME_EVENTS.end, null);
          onEndGame(room);
          return;
        }

        await room.save();

        socket.to(roomId).emit(GAME_EVENTS.yourTurn);
      }
    }
  );

  socket.on(APP_EVENTS.disconnect, async () => {
    const { roomId, playerSign } = socket.data;
    const room = await GameRoomModel.findById(roomId);
    if (room?.isActive) {
      const oppositePlayerId = room.player2?._id.toString();
      oppositePlayerId && increaseWinnerPoints(oppositePlayerId);
      io.in(roomId).emit(GAME_EVENTS.end, returnOpositeSign(playerSign));
      onEndGame(room);
    }
  });
};

export default gameHandler;
