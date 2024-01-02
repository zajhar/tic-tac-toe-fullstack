import { User } from "../types/user.type";

//NOT USED AT ALL BUT LEFT FOR FUTURE
const SESSION_STORAGE_KEY = "tic_tac_toe:user";

const getUser = (): User | undefined =>
  JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY) || "");

const setUser = (user: User) =>
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));

export { getUser, setUser };
