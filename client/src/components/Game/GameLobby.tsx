import { GameStateType } from "../../hooks/useGameSockets.hook";

type GameLobbyProps = {
  gameState: GameStateType;
  lobbySize: number;
  joinLobby: () => void;
  leaveLobby: () => void;
};

const GameLobby = ({
  gameState,
  lobbySize,
  joinLobby,
  leaveLobby,
}: GameLobbyProps) => {
  return (
    <div className="w-full">
      {!gameState.isGameActive && (
        <div className="mx-auto flex max-w-xs flex-col gap-y-4 justify-center text-center mb-5">
          <dt className="text-base leading-7 text-gray-600">
            {lobbySize === 1 ? "Player" : "Players"} in lobby
          </dt>
          <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            {lobbySize}
          </dd>
        </div>
      )}
      {gameState.isInLobby ? (
        <button
          onClick={() => leaveLobby()}
          className={`mb-5 cursor-pointer flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-red-600 focus-visible:outline-red-600 hover:bg-red-500`}
        >
          Leave Lobby!
        </button>
      ) : (
        <button
          onClick={() => joinLobby()}
          disabled={
            !gameState.isConnected ||
            gameState.isGameActive ||
            gameState.isInLobby
          }
          className={`mb-5 cursor-pointer flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  ${
            gameState.isInLobby
              ? " bg-slate-600"
              : " bg-indigo-600 focus-visible:outline-indigo-600 hover:bg-indigo-500"
          }`}
        >
          Join Lobby!
        </button>
      )}
    </div>
  );
};

export { GameLobby };
