import { GameStateType } from "../../hooks/useGameSockets.hook";
import { GameTile } from "./GameTile";

type GameBoardProps = {
  gameState: GameStateType;
  board: (string | null)[];
  onTileClick: (i: string) => void;
};

const GameBoard = ({ gameState, board, onTileClick }: GameBoardProps) => {
  return (
    <div
      className={`flex flex-col gap-2 ${
        gameState.isGameActive
          ? ""
          : "opacity-50 bg-slate-50 cursor-not-allowed"
      }`}
    >
      <div className="flex gap-2">
        {board.slice(0, 3).map((val, i) => (
          <GameTile value={val} key={i} index={i} onClick={onTileClick} />
        ))}
      </div>
      <div className="flex gap-2">
        {board.slice(3, 6).map((val, i) => (
          <GameTile
            value={val}
            key={i + 3}
            index={i + 3}
            onClick={onTileClick}
          />
        ))}
      </div>
      <div className="flex gap-2">
        {board.slice(6, 9).map((val, i) => (
          <GameTile
            value={val}
            key={i + 6}
            index={i + 6}
            onClick={onTileClick}
          />
        ))}
      </div>
    </div>
  );
};

export { GameBoard };
