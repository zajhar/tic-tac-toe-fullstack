import { User } from "../../types/user.type";

type GameMatchDetailsProps = {
  oppositePlayer: User;
  userDetails: User;
};

const GameMatchDetails = ({
  oppositePlayer,
  userDetails,
}: GameMatchDetailsProps) => {
  return (
    <div className="w-full flex gap-10 items-center justify-center text-center mb-10">
      <div className="flex-1 flex flex-col border-2 border-green-600 rounded-lg p-5">
        <span className="text-6xl">🐶</span>
        <span className="font-bold text-2xl">{userDetails.username}</span>
        <span>{userDetails.points} points</span>
      </div>
      <span className="text-4xl">vs</span>
      <div className="flex-1 flex flex-col border-2 border-red-600 rounded-lg p-5">
        <span className="text-6xl">🐱</span>
        <span className="font-bold text-2xl">{oppositePlayer.username}</span>
        <span>{oppositePlayer.points} points</span>
      </div>
    </div>
  );
};

export { GameMatchDetails };
