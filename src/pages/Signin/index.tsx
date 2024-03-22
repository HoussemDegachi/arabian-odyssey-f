import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { useLocalStorageToken } from "@/contexts/LocalStorageTokenContext";
import { useUser } from "@/contexts/UserContext";
import { Loading } from "@/components/Loading";
import { Input } from "@/components/Input";
import { SubmitButton } from "@/components/SubmitButton";

export function Signin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setErrors] = useState<string[] | string>([]);
  const [loading, setLoading] = useState(false);
  const { setToken } = useLocalStorageToken();
  const navigate = useNavigate();
  const { user } = useUser();

  if (user) navigate("/");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    setLoading(true);

    axios
      .post("https://arabian-odyssey.vercel.app/auth/signin", JSON.stringify(formData), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res: AxiosResponse) => res.data)
      .then((data: { message: string; token: string; err?: string | { message: string }[] }) => {
        if (data.err) {
          setErrors(
            typeof data.err === "string"
              ? data.err
              : data.err.map((err: { message: string }) => err.message)
          );
        }
        if (data.message === "success") {
          setToken(data.token);
          () => setTimeout(() => navigate("/"), 10);
        }
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <section className="flex flex-grow flex-col items-center pt-6">
      {loading && <Loading />}
      <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl">
            Welcome agin!
          </h1>
          <form className="space-y-4 md:space-y-6" method="POST" onSubmit={handleSubmit}>
            {error.length > 0 && (
              <div className="space-y-5" role="alert">
                {Array.isArray(error) ? (
                  error.map((err) => (
                    <p
                      key={err}
                      className="lg:text-lg rounded-lg border border-red-600 bg-red-200 px-2 py-2 text-sm font-semibold text-red-600 md:text-base"
                      aria-label={err}
                    >
                      {err}
                    </p>
                  ))
                ) : (
                  <p
                    className="lg:text-lg rounded-lg border border-red-600 bg-red-200 px-2 py-2 text-sm font-semibold text-red-600 md:text-base"
                    aria-label={error}
                  >
                    {error === "user already exist" ? (
                      <>
                        user already exist. Please <Link to="/signin">sign in</Link> or use a
                        different email address.
                      </>
                    ) : (
                      error
                    )}
                  </p>
                )}
              </div>
            )}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-black">
                Email
              </label>
              <Input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="John_doe@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-black">
                Password
              </label>
              <Input
                type="password"
                name="password"
                id="password"
                minLength={3}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <SubmitButton>Log in</SubmitButton>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link className="font-medium text-primary hover:underline" to="/signup">
                Sing up here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
