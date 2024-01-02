import { useEffect, useState } from "react";
import { getAllRooms } from "../../services/room.service";
import { GameRoom } from "../../types/room.type";

function BoardHistoryContainer() {
  const [gameHistory, setGameHistory] = useState<GameRoom[]>();

  const fetchGameHistory = async () => {
    try {
      const data = await getAllRooms();
      setGameHistory(data);
    } catch (e) {
      console.warn(e);
    }
  };
  useEffect(() => {
    fetchGameHistory();
  }, []);

  return (
    <div className="flex flex-col min-h-full flex-1 flex-wrap justify-center px-6 py-12 gap-10">
      <h3 className="text-2xl">Game History</h3>

      <div className="flex flex-col">
        <div className="overflow-auto shadow-md sm:rounded-lg h-80 ">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                    >
                      Player 1
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                    >
                      Player 2
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                    >
                      Game Length
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {gameHistory?.map((game) => (
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {game.player1.username}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {game.player2.username}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {new Date(game.createdAt).toDateString()}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {Math.floor(
                          (Math.abs(
                            new Date(game.createdAt).getTime() -
                              new Date(game.endedAt).getTime()
                          ) /
                            1000) %
                            60
                        )}{" "}
                        seconds
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { BoardHistoryContainer };
