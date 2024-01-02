import { defaultFormValidation } from "../../hooks/useAuthForm.hook";

const SignUpBox = ({
  onFormSubmit,
  formErrors,
  submitError,
}: {
  onFormSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  formErrors: typeof defaultFormValidation;
  submitError: string;
}) => {
  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" onSubmit={onFormSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Username
          </label>
          <div className="mt-2">
            <input
              id="username"
              name="username"
              type="username"
              required
              className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {formErrors.username && (
              <span className="text-red-800 text-sm">
                {formErrors.username}
              </span>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {formErrors.password && (
              <span className="text-red-800 text-sm	">
                {formErrors.password}
              </span>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign up
          </button>
          {submitError && (
            <span className="text-red-800 text-sm	">{submitError}</span>
          )}
        </div>
      </form>
    </div>
  );
};

export { SignUpBox };
