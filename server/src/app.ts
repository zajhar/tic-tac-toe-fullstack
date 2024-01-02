import { config } from "dotenv";
config();
import express from "express";
import usersRoutes from "./routes/users.route";
import gameRoomsRoutes from "./routes/gameRooms.route";
import morgan from "morgan";
import helmet from "helmet";
import createHttpError from "http-errors";
import session from "express-session";
import { Server } from "socket.io";
import * as http from "http";
import cors from "cors";
import connectDB from "./config/db";
import registerGameHandler from "./socketHandlers/gameHandler.socket";
import registerLobbyHandler from "./socketHandlers/lobbyHandler.socket";
import registerSocketAuthMiddleware from "./middleware/socket_auth.middleware";
const PORT = process.env.PORT;

declare module "express-session" {
  interface SessionData {
    count: number;
  }
}

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const server = http.createServer(app);

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "",
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
});

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(sessionMiddleware);

app.use("/api/users", usersRoutes);
app.use("/api/gamerooms", gameRoomsRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.engine.use(sessionMiddleware);

connectDB();

server.listen(PORT, () => {
  console.log("🔥 Server running on port: " + PORT);
});

registerSocketAuthMiddleware(io);
io.on("connection", (socket) => {
  registerLobbyHandler(io, socket);
  registerGameHandler(io, socket);
});

// TODO add swagger with tsoa
// app.use(
//   "/docs",
//   swaggerUi.serve,
//   swaggerUi.setup(undefined, {
//     swaggerOptions: {
//       url: "public/swagger.json",
//     },
//   })
// );
