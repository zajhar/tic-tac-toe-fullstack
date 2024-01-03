"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const users_route_1 = __importDefault(require("./routes/users.route"));
const gameRooms_route_1 = __importDefault(require("./routes/gameRooms.route"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const http_errors_1 = __importDefault(require("http-errors"));
const express_session_1 = __importDefault(require("express-session"));
const socket_io_1 = require("socket.io");
const http = __importStar(require("http"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const gameHandler_socket_1 = __importDefault(require("./socketHandlers/gameHandler.socket"));
const lobbyHandler_socket_1 = __importDefault(require("./socketHandlers/lobbyHandler.socket"));
const socket_auth_middleware_1 = __importDefault(require("./middleware/socket_auth.middleware"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
const server = http.createServer(app);
const sessionMiddleware = (0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
});
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(sessionMiddleware);
app.use("/docs", swagger_ui_express_1.default.serve, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send(swagger_ui_express_1.default.generateHTML(yield Promise.resolve().then(() => __importStar(require("../build/swagger.json")))));
}));
app.use("/api/users", users_route_1.default);
app.use("/api/gamerooms", gameRooms_route_1.default);
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404, "Endpoint not found"));
});
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});
io.engine.use(sessionMiddleware);
(0, db_1.default)();
server.listen(PORT, () => {
    console.log("🔥 Server running on port: " + PORT);
});
(0, socket_auth_middleware_1.default)(io);
io.on("connection", (socket) => {
    (0, lobbyHandler_socket_1.default)(io, socket);
    (0, gameHandler_socket_1.default)(io, socket);
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
