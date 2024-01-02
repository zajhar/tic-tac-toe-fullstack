import { GameStateType } from "../../hooks/useGameSockets.hook";
import { Loader } from "../icons/Loader";
import { User } from "../../types/user.type";

type GameBoardProps = {
  gameState: GameStateType;
  oppositePlayer: User | null;
};

const GameInstructions = ({ gameState, oppositePlayer }: GameBoardProps) => {
  return (
    <div className="w-full flex justify-center text-xl mb-5 h-10">
      <div className="flex items-center">
        {gameState.isInLobby && (
          <span>
            <Loader />
            Waiting in lobby...
          </span>
        )}
      </div>
      <div>{gameState.isMyTurn && <span>🔥 Your Turn!</span>}</div>
      <div>
        {!gameState.isMyTurn && gameState.isGameActive && (
          <span>⏳ Waiting for {oppositePlayer?.username} decision...</span>
        )}
      </div>
    </div>
  );
};

export { GameInstructions };
