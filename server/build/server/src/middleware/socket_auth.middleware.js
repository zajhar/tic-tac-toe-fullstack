"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketAuthMiddleware = (io) => {
    io.use((defaultSocket, next) => {
        const socket = defaultSocket;
        const userId = socket.request.session.userId;
        if (userId) {
            return next();
        }
        console.log("👹 User Not Authenticated!", socket.id);
        return next(new Error("User not authenticated"));
    });
};
exports.default = socketAuthMiddleware;
