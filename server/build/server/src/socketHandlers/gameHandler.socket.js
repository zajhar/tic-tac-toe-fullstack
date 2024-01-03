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
const game_helper_1 = require("../helpers/game.helper");
const socketEvents_1 = require("../../../shared/socketEvents");
const onEndGame = (room) => __awaiter(void 0, void 0, void 0, function* () {
    room.isActive = false;
    room.endedAt = new Date();
    yield room.save();
});
const increaseWinnerPoints = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId).exec();
    if (user) {
        user.points = (user.points || 0) + 5;
        user.save();
    }
});
const gameHandler = (io, socket) => __awaiter(void 0, void 0, void 0, function* () {
    const request = socket.request;
    const userId = request.session.userId;
    socket.on(socketEvents_1.GAME_EVENTS.move, (tileId, callback) => __awaiter(void 0, void 0, void 0, function* () {
        const { roomId, playerSign } = socket.data;
        const room = yield gameRoom_model_1.default.findById(roomId);
        if (!room || !(room === null || room === void 0 ? void 0 : room.isActive)) {
            console.log("❌ Room is not valid! ", roomId);
            return;
        }
        if (tileId >= 0 && tileId <= 9 && (room === null || room === void 0 ? void 0 : room.lastMove) !== userId) {
            const boardCopy = room.board[room.board.length - 1];
            if (boardCopy[tileId] !== null) {
                io.to(socket.id).emit(socketEvents_1.GAME_EVENTS.error, "Tile is already choosen!");
                console.log("❌ User choose already choosen tile! ", roomId);
                return;
            }
            callback({ status: "ok" });
            boardCopy[tileId] = playerSign;
            room.board = [...room.board, boardCopy];
            room.lastMove = userId;
            io.in(roomId).emit(socketEvents_1.GAME_EVENTS.updateBoard, boardCopy);
            const isWinner = (0, game_helper_1.calculateWinner)(boardCopy);
            if (isWinner) {
                onEndGame(room);
                userId && increaseWinnerPoints(userId);
                io.in(roomId).emit(socketEvents_1.GAME_EVENTS.end, socket.data.playerSign);
                return;
            }
            const anyMovesLeft = boardCopy.some((x) => x === null);
            if (!anyMovesLeft) {
                io.in(roomId).emit(socketEvents_1.GAME_EVENTS.end, null);
                onEndGame(room);
                return;
            }
            yield room.save();
            socket.to(roomId).emit(socketEvents_1.GAME_EVENTS.yourTurn);
        }
    }));
    socket.on(socketEvents_1.APP_EVENTS.disconnect, () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { roomId, playerSign } = socket.data;
        const room = yield gameRoom_model_1.default.findById(roomId);
        if (room === null || room === void 0 ? void 0 : room.isActive) {
            const oppositePlayerId = (_a = room.player2) === null || _a === void 0 ? void 0 : _a._id.toString();
            oppositePlayerId && increaseWinnerPoints(oppositePlayerId);
            io.in(roomId).emit(socketEvents_1.GAME_EVENTS.end, (0, game_helper_1.returnOpositeSign)(playerSign));
            onEndGame(room);
        }
    }));
});
exports.default = gameHandler;
