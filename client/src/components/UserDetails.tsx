import { User } from "../types/user.type";

type UserDetailsProps = {
  userDetails: User;
  logout: () => void;
};

const UserDetails = ({ userDetails, logout }: UserDetailsProps) => {
  return (
    <>
      <p className="text-sm block mt-2">
        Logged in as{" "}
        <span className="text-green-600 font-bold">
          {userDetails?.username}
        </span>
        , points: {userDetails.points}
      </p>
      <button
        onClick={() => logout()}
        className=" mt-2 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10"
      >
        Logout
      </button>
    </>
  );
};

export { UserDetails };
