export const APP_EVENTS = {
  disconnect: "disconnect",
  connect: "connect",
  hello: "hello"
};

export const LOBBY_EVENTS = {
  join: "lobby:join",
  leave: "lobby:leave",
  playersAmount: "lobby:playersAmount",
  error: "lobby:error",
};

export const GAME_EVENTS = {
  move: "game:move",
  start: "game:start",
  yourTurn: "game:yourTurn",
  updateBoard: "game:updateBoard",
  end: "game:end",
  error: "game:error",
};
