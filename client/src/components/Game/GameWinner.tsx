import { GameSigns } from "../../types/socket.type";

type GameWinnerProps = {
  lastWin?: string | null;
  currentSign?: GameSigns;
};

const GameWinner = ({ lastWin, currentSign }: GameWinnerProps) => {
  let text = "";
  console.log(lastWin, currentSign);
  if (lastWin === null) {
    text = "🤷‍♂️ No one won!";
  } else if (lastWin === currentSign) {
    text = "🎉 You won!";
  } else {
    text = "👎 You lose!";
  }

  return <p className="text-5xl mb-5">{text}</p>;
};

export { GameWinner };
