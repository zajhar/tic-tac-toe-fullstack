import { AuthContainer } from "./components/Auth/AuthContainer";
import { useUserDetails } from "./hooks/useUserDetails.hook";
import { GameContainer } from "./components/Game/GameContainer";
import { BoardHistoryContainer } from "./components/BoardHistory/BoardHistoryContainer";
import { UserDetails } from "./components/UserDetails";

function App() {
  const { isUserLoggedIn, onAuthForm, userDetails, logout } = useUserDetails();

  return (
    <div className="justify-center flex items-center">
      <div className="flex max-w-screen-xl min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="w-full flex flex-col items-center justify-center">
          <h2 className="text-5xl	">Tic Tac Toe</h2>
          {userDetails && (
            <UserDetails userDetails={userDetails} logout={logout} />
          )}
        </div>
        {!isUserLoggedIn && <AuthContainer onAuthForm={onAuthForm} />}
        {isUserLoggedIn && userDetails && (
          <>
            <GameContainer userDetails={userDetails} />
            <BoardHistoryContainer />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
