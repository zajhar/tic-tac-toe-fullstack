"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const gameRoomSchema = new mongoose_1.Schema({
    player1: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    player2: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: () => Date.now() },
    endedAt: { type: Date },
    board: [
        [String, String, String, String, String, String, String, String, String],
    ],
    isActive: { type: Boolean, default: true },
    lastMove: { type: String },
});
exports.default = (0, mongoose_1.model)("GameRoom", gameRoomSchema);
