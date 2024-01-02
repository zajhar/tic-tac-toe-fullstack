import { Request } from "express";
import GameRoomModel, { GameRoom } from "../models/gameRoom.model";
import UserModel from "../models/user.model";
import { Server, Socket } from "socket.io";
import { SocketData } from "../types/Sockets.type";
import { gameLobby, LobbyItem } from "../utils/lobby.util";
import { GameSigns } from "../types/Sockets.type";
import {
  GAME_EVENTS,
  LOBBY_EVENTS,
  APP_EVENTS,
} from "../../../shared/socketEvents";

const getUserByID = (userId: string) =>
  UserModel.findById(userId).select("-password").exec();

const handleUserSetup = ({
  room,
  user,
  sign,
}: {
  room: GameRoom;
  user: LobbyItem;
  sign: GameSigns;
}) => {
  user.socket.data = {
    roomId: room._id.toString(),
    playerSign: sign,
  };

  user?.socket.join(room.id);
};

type SocketCallback = ({ status }: { status: "ok" | "error" }) => void;

const lobbyHandler = (
  io: Server,
  socket: Socket<any, any, any, SocketData>
) => {
  io.emit(LOBBY_EVENTS.playersAmount, gameLobby.getLobbySize());
  const request = socket.request as Request;
  const userId = request.session.userId;

  console.log("🍀 New User connected! ", userId);

  socket.on(LOBBY_EVENTS.join, async (callback: SocketCallback) => {
    if (userId && !gameLobby.isUserInLobby(userId)) {
      const user = await UserModel.findById(userId).select("points").exec();

      gameLobby.addToLobby({ socket, userId, score: user?.points || 0 });
      console.log("👍 User in lobby", userId);
      callback({ status: "ok" });
      io.emit(LOBBY_EVENTS.playersAmount, gameLobby.getLobbySize());
    } else {
      io.to(socket.id).emit(
        LOBBY_EVENTS.error,
        "You are already in the lobby!"
      );
      console.log("User already in lobby! ", userId);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));

    if (gameLobby.getLobbySize() >= 2) {
      console.log("🤝 New Game!");
      const [player1Socket, player2Socket] = gameLobby.getFirstTwoUsers();
      io.emit(LOBBY_EVENTS.playersAmount, gameLobby.getLobbySize());

      if (player1Socket && player2Socket) {
        const [player1, player2] = [
          await getUserByID(player1Socket?.userId),
          await getUserByID(player2Socket?.userId),
        ];

        if (player1 && player2) {
          const newRoom = await GameRoomModel.create({
            player1,
            player2,
            board: Array(9).fill(null),
          });

          handleUserSetup({
            room: newRoom,
            user: player1Socket,
            sign: GameSigns.X,
          });

          handleUserSetup({
            room: newRoom,
            user: player2Socket,
            sign: GameSigns.O,
          });

          console.log("🤝 Game CREATED:, ", newRoom.id);

          //Emit to all users
          io.in(newRoom.id).emit(GAME_EVENTS.start, {
            [player1.id]: {
              user: player1,
              sign: player1Socket.socket.data.playerSign,
            },
            [player2.id]: {
              user: player2,
              sign: player2Socket.socket.data.playerSign,
            },
          });
          socket.to(newRoom.id).emit(GAME_EVENTS.yourTurn);
        }
      }
    }
  });

  socket.on(APP_EVENTS.disconnect, () => {
    if (userId && gameLobby.isUserInLobby(userId)) {
      userId && gameLobby.removeFromLobby(userId);
      io.emit(LOBBY_EVENTS.playersAmount, gameLobby.getLobbySize());
      console.log("👉 User disconected and left lobby! ", userId);
    }
  });

  socket.on(LOBBY_EVENTS.leave, (callback: SocketCallback) => {
    userId && gameLobby.removeFromLobby(userId);
    io.emit(LOBBY_EVENTS.playersAmount, gameLobby.getLobbySize());
    callback({ status: "ok" });
    console.log("👉 User left lobby! ", userId);
  });

  //Just a test socket
  socket.on(APP_EVENTS.hello, () => {
    socket.to(Array.from(socket.rooms)[1]).emit("hello");
  });
};

export default lobbyHandler;
