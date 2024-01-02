type GameTileProps = {
  index: number;
  value: string | null;
  onClick: (tile: string) => void;
};

function GameTile({ index, value, onClick }: GameTileProps) {
  return (
    <div
      className="flex w-[120px] flex-1 text-7xl border-2 rounded-lg justify-center items-center aspect-square"
      onClick={() => onClick(`${index}`)}
    >
      {value || ""}
    </div>
  );
}

export { GameTile };
