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
exports.getUserRooms = exports.getGameRoomById = void 0;
const gameRoom_model_1 = __importDefault(require("../models/gameRoom.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const getGameRoomById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomId = req.params.gameRoomId;
        if (!roomId) {
            return res.status(300).send({ error: "No roomID specified!" });
        }
        const room = yield gameRoom_model_1.default.findById(roomId);
        if (!room) {
            return res.status(404).send({ error: "Room not find!" });
        }
        res.status(201).json(room);
    }
    catch (error) {
        next(error);
    }
});
exports.getGameRoomById = getGameRoomById;
const getUserRooms = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.session.userId).exec();
        const inactiveRooms = yield gameRoom_model_1.default.find({
            $or: [{ player1: user }, { player2: user }],
            isActive: false,
        }).populate("player1 player2");
        return res.status(201).json(inactiveRooms);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserRooms = getUserRooms;
