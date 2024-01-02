import { useState } from "react";
import { AuthForm } from "../services/user.service";
import axios from "axios";

export const defaultFormValidation = {
  username: "",
  password: "",
};

export enum SubmitType {
  SignIn = "SIGNIN",
  SignUp = "SIGNUP",
}

type UseAuthHookProps = {
  type: SubmitType;
  onAuthForm: ({
    data,
    type,
  }: {
    data: AuthForm;
    type: SubmitType;
  }) => Promise<void>;
};

export const useAuthForm = ({ type, onAuthForm }: UseAuthHookProps) => {
  const [formErrors, setFormErrors] = useState(defaultFormValidation);
  const [submitError, setSubmitError] = useState("");

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    const data = new FormData(event.currentTarget);
    const username = data.get("username")?.toString();
    const password = data.get("password")?.toString();

    if (!username || username.length <= 2) {
      setFormErrors((oldVal) => ({
        ...oldVal,
        username: "Username should be at least two characters long",
      }));
      return;
    }
    if (!password || password.length <= 2) {
      setFormErrors((oldVal) => ({
        ...oldVal,
        password: "Password should be at least two characters long",
      }));
      return;
    }
    setFormErrors(defaultFormValidation);

    try {
      await onAuthForm({ data: { username, password }, type });
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setSubmitError(e?.response?.data?.error);
      }
    }
  };

  return {
    onFormSubmit,
    formErrors,
    submitError,
  };
};
