import { Server, Socket } from "socket.io";
import session from "express-session";
import * as http from "http";

interface SessionIncomingMessage extends http.IncomingMessage {
  session: session.SessionData;
}

export interface SessionSocket extends Socket {
  request: SessionIncomingMessage;
}

const socketAuthMiddleware = (io: Server) => {
  io.use((defaultSocket, next) => {
    const socket = <SessionSocket>defaultSocket;

    const userId = socket.request.session.userId;
    if (userId) {
      return next();
    }
    console.log("👹 User Not Authenticated!", socket.id);
    return next(new Error("User not authenticated"));
  });
};

export default socketAuthMiddleware;
