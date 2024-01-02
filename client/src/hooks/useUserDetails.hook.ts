import { useEffect, useState } from "react";
import { User } from "../types/user.type";
import {
  logoutUser,
  getCurrentUser,
  signIn,
  signUp,
  AuthForm,
} from "../services/user.service";
import { SubmitType } from "./useAuthForm.hook";

export const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const fetchCurrentUser = async () => {
    try {
      const data = await getCurrentUser();
      setUserDetails(data);
    } catch (e) {
      console.error(e);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUserDetails(null);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const onAuthForm = async ({
    data,
    type,
  }: {
    data: AuthForm;
    type: SubmitType;
  }) => {
    const authFunc = type === SubmitType.SignIn ? signIn : signUp;

    const resp = await authFunc(data);
    if (resp) {
      setUserDetails(resp);
    }
  };

  const isUserLoggedIn = !!userDetails;

  return { isUserLoggedIn, userDetails, fetchCurrentUser, onAuthForm, logout };
};
