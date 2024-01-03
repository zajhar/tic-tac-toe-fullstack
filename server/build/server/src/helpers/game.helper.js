"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnOpositeSign = exports.calculateWinner = void 0;
const Sockets_type_1 = require("../types/Sockets.type");
const calculateWinner = (squares) => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return true;
        }
    }
    return false;
};
exports.calculateWinner = calculateWinner;
const returnOpositeSign = (sign) => sign === Sockets_type_1.GameSigns.O ? Sockets_type_1.GameSigns.X : Sockets_type_1.GameSigns.O;
exports.returnOpositeSign = returnOpositeSign;
