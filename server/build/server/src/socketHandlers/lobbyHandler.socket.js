"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameRoom_model_1 = __importDefault(require("../models/gameRoom.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const lobby_util_1 = require("../utils/lobby.util");
const Sockets_type_1 = require("../types/Sockets.type");
const socketEvents_1 = require("../../../shared/socketEvents");
const getUserByID = (userId) => user_model_1.default.findById(userId).select("-password").exec();
const handleUserSetup = ({ room, user, sign, }) => {
    user.socket.data = {
        roomId: room._id.toString(),
        playerSign: sign,
    };
    user === null || user === void 0 ? void 0 : user.socket.join(room.id);
};
const lobbyHandler = (io, socket) => {
    io.emit(socketEvents_1.LOBBY_EVENTS.playersAmount, lobby_util_1.gameLobby.getLobbySize());
    const request = socket.request;
    const userId = request.session.userId;
    console.log("🍀 New User connected! ", userId);
    socket.on(socketEvents_1.LOBBY_EVENTS.join, (callback) => __awaiter(void 0, void 0, void 0, function* () {
        if (userId && !lobby_util_1.gameLobby.isUserInLobby(userId)) {
            const user = yield user_model_1.default.findById(userId).select("points").exec();
            lobby_util_1.gameLobby.addToLobby({ socket, userId, score: (user === null || user === void 0 ? void 0 : user.points) || 0 });
            console.log("👍 User in lobby", userId);
            callback({ status: "ok" });
            io.emit(socketEvents_1.LOBBY_EVENTS.playersAmount, lobby_util_1.gameLobby.getLobbySize());
        }
        else {
            io.to(socket.id).emit(socketEvents_1.LOBBY_EVENTS.error, "You are already in the lobby!");
            console.log("User already in lobby! ", userId);
            return;
        }
        yield new Promise((resolve) => setTimeout(resolve, 5000));
        if (lobby_util_1.gameLobby.getLobbySize() >= 2) {
            console.log("🤝 New Game!");
            const [player1Socket, player2Socket] = lobby_util_1.gameLobby.getFirstTwoUsers();
            io.emit(socketEvents_1.LOBBY_EVENTS.playersAmount, lobby_util_1.gameLobby.getLobbySize());
            if (player1Socket && player2Socket) {
                const [player1, player2] = [
                    yield getUserByID(player1Socket === null || player1Socket === void 0 ? void 0 : player1Socket.userId),
                    yield getUserByID(player2Socket === null || player2Socket === void 0 ? void 0 : player2Socket.userId),
                ];
                if (player1 && player2) {
                    const newRoom = yield gameRoom_model_1.default.create({
                        player1,
                        player2,
                        board: Array(9).fill(null),
                    });
                    handleUserSetup({
                        room: newRoom,
                        user: player1Socket,
                        sign: Sockets_type_1.GameSigns.X,
                    });
                    handleUserSetup({
                        room: newRoom,
                        user: player2Socket,
                        sign: Sockets_type_1.GameSigns.O,
                    });
                    console.log("🤝 Game CREATED:, ", newRoom.id);
                    //Emit to all users
                    io.in(newRoom.id).emit(socketEvents_1.GAME_EVENTS.start, {
                        [player1.id]: {
                            user: player1,
                            sign: player1Socket.socket.data.playerSign,
                        },
                        [player2.id]: {
                            user: player2,
                            sign: player2Socket.socket.data.playerSign,
                        },
                    });
                    socket.to(newRoom.id).emit(socketEvents_1.GAME_EVENTS.yourTurn);
                }
            }
        }
    }));
    socket.on(socketEvents_1.APP_EVENTS.disconnect, () => {
        if (userId && lobby_util_1.gameLobby.isUserInLobby(userId)) {
            userId && lobby_util_1.gameLobby.removeFromLobby(userId);
            io.emit(socketEvents_1.LOBBY_EVENTS.playersAmount, lobby_util_1.gameLobby.getLobbySize());
            console.log("👉 User disconected and left lobby! ", userId);
        }
    });
    socket.on(socketEvents_1.LOBBY_EVENTS.leave, (callback) => {
        userId && lobby_util_1.gameLobby.removeFromLobby(userId);
        io.emit(socketEvents_1.LOBBY_EVENTS.playersAmount, lobby_util_1.gameLobby.getLobbySize());
        callback({ status: "ok" });
        console.log("👉 User left lobby! ", userId);
    });
    //Just a test socket
    socket.on(socketEvents_1.APP_EVENTS.hello, () => {
        socket.to(Array.from(socket.rooms)[1]).emit("hello");
    });
};
exports.default = lobbyHandler;
