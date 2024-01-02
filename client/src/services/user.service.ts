import apiLatest from "../config/api";
import { User } from "../types/user.type";

export type AuthForm = {
  username: string;
  password: string;
};

const getCurrentUser = async () =>
  apiLatest.get<User>(`/users`).then((res) => res.data);

const signIn = async (authData: AuthForm) =>
  apiLatest.post<User>(`/users/login`, authData).then((res) => res.data);

const signUp = async (authData: AuthForm) =>
  apiLatest.post<User>(`/users/signup`, authData).then((res) => res.data);

const logoutUser = async () =>
  apiLatest.post(`/users/logout`).then((res) => res.data);

export { getCurrentUser, signIn, signUp, logoutUser };
