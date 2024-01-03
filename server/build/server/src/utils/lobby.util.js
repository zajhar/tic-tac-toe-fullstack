"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameLobby = void 0;
//Could be a class also :) 
const LobbyFactory = () => {
    let gameLobby = [];
    const addToLobby = (item) => {
        gameLobby.push(item);
        gameLobby = gameLobby.sort((a, b) => b.score - a.score);
    };
    const isUserInLobby = (userId) => gameLobby.some((x) => x.userId === userId);
    const getFirstTwoUsers = () => [gameLobby.shift(), gameLobby.shift()];
    const removeFromLobby = (userId) => {
        gameLobby = gameLobby.filter((x) => x.userId !== userId);
    };
    const getLobbySize = () => gameLobby.length;
    return {
        addToLobby,
        isUserInLobby,
        getFirstTwoUsers,
        removeFromLobby,
        getLobbySize,
    };
};
exports.gameLobby = LobbyFactory();
