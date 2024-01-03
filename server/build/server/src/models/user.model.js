"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    points: { type: Number, required: false, default: 0 },
    createdAt: { type: Date, default: () => Date.now() },
});
exports.default = (0, mongoose_1.model)("User", userSchema);
