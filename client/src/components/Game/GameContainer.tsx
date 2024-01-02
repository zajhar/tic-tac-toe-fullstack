import { useGameSockets } from "../../hooks/useGameSockets.hook";
import { User } from "../../types/user.type";
import { GameStatus } from "./GameStatus";
import { GameLobby } from "./GameLobby";
import { GameMatchDetails } from "./GameMatchDetails";
import { GameWinner } from "./GameWinner";
import { GameBoard } from "./GameBoard";
import { GameInstructions } from "./GameInstructions";

type GameContainerProps = {
  userDetails: User;
};

function GameContainer({ userDetails }: GameContainerProps) {
  const {
    gameState,
    board,
    joinLobby,
    makeMove,
    oppositePlayer,
    lobbySize,
    leaveLobby,
    lastWin,
    currentSign,
  } = useGameSockets({
    userDetails,
  });

  const onTileClick = (tile: string) => {
    if (gameState.isConnected && gameState.isMyTurn) {
      makeMove(tile);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-wrap justify-center px-6 py-12 gap-10">
      <div className="flex-1 flex justify-center min-w-20 items-center">
        <div className="flex flex-col">
          <GameInstructions
            gameState={gameState}
            oppositePlayer={oppositePlayer}
          />
          <GameBoard
            gameState={gameState}
            board={board}
            onTileClick={onTileClick}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center w-full">
        {!gameState.isGameActive && gameState.showResult && currentSign && (
          <GameWinner currentSign={currentSign} lastWin={lastWin} />
        )}
        {gameState.isGameActive && oppositePlayer && (
          <GameMatchDetails
            userDetails={userDetails}
            oppositePlayer={oppositePlayer}
          />
        )}
        {!gameState.isGameActive && (
          <GameLobby
            gameState={gameState}
            lobbySize={lobbySize}
            joinLobby={joinLobby}
            leaveLobby={leaveLobby}
          />
        )}

        <GameStatus gameState={gameState} />
      </div>
    </div>
  );
}

export { GameContainer };
