"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_EVENTS = exports.LOBBY_EVENTS = exports.APP_EVENTS = void 0;
exports.APP_EVENTS = {
    disconnect: "disconnect",
    connect: "connect",
    hello: "hello"
};
exports.LOBBY_EVENTS = {
    join: "lobby:join",
    leave: "lobby:leave",
    playersAmount: "lobby:playersAmount",
    error: "lobby:error",
};
exports.GAME_EVENTS = {
    move: "game:move",
    start: "game:start",
    yourTurn: "game:yourTurn",
    updateBoard: "game:updateBoard",
    end: "game:end",
    error: "game:error",
};
