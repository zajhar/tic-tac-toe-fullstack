import { useState } from "react";
import { SignInBox } from "./SignInBox";
import { SignUpBox } from "./SignUpBox";
import { SubmitType, useAuthForm } from "../../hooks/useAuthForm.hook";
import { AuthForm } from "../../services/user.service";

type AuthContainerParams = {
  onAuthForm: ({
    data,
    type,
  }: {
    data: AuthForm;
    type: SubmitType;
  }) => Promise<void>;
};

const AuthContainer = ({ onAuthForm }: AuthContainerParams) => {
  const [type, setType] = useState<SubmitType>(SubmitType.SignIn);

  const { onFormSubmit, formErrors, submitError } = useAuthForm({
    type,
    onAuthForm,
  });

  const toggleFormType = () => {
    setType((oldVal) =>
      oldVal === SubmitType.SignIn ? SubmitType.SignUp : SubmitType.SignIn
    );
  };

  const isSignIn = type === SubmitType.SignIn;

  const SignComponent = isSignIn ? SignInBox : SignUpBox;

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <SignComponent
        onFormSubmit={onFormSubmit}
        formErrors={formErrors}
        submitError={submitError}
      />
      <p className="mt-8 text-center text-sm text-gray-500 cursor-pointer">
        <span
          onClick={() => toggleFormType()}
          className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          {isSignIn ? "Sign up" : "Sign in"}
        </span>
      </p>
    </div>
  );
};

export { AuthContainer };
