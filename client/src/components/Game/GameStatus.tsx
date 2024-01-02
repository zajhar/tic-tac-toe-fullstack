import { useState } from "react";
import { GameStateType } from "../../hooks/useGameSockets.hook";

type GameStatusProps = {
  gameState: GameStateType;
};

const GameStatus = ({ gameState }: GameStatusProps) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className="w-full">
      <button
        onClick={() => setShowDetails((old) => !old)}
        className="block items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
      >
        {showDetails ? "Hide" : "Show"} Game Details
      </button>

      {showDetails && (
        <div className="inline-block mr-2">
          <div>
            <span>Connection Status:</span>
            {gameState.isConnected ? (
              <span className=" text-green-500">💚 Connected</span>
            ) : (
              <span className=" text-red-500">💔 Disconnected</span>
            )}
          </div>
          <div>
            <span>Game Status:</span>
            {gameState.isGameActive ? (
              <span className=" text-green-500">💚 Active</span>
            ) : (
              <span className=" text-red-500">💔 Not active</span>
            )}
          </div>
          <div>
            <span>In lobby:</span>
            {gameState.isInLobby ? (
              <span className=" text-green-500">💚 true</span>
            ) : (
              <span className=" text-red-500">💔 false</span>
            )}
          </div>
          <div>
            <span>Is my turn:</span>
            {gameState.isMyTurn ? (
              <span className=" text-green-500">💚 true</span>
            ) : (
              <span className=" text-red-500">💔 false</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { GameStatus };
