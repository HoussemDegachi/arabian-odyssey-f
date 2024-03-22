import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { User } from "@/types/user";
import { useLocalStorageToken } from "@/contexts/LocalStorageTokenContext";
import { useUser } from "@/contexts/UserContext";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";
import { Error } from "@/pages/Error";
import { Signup } from "@/pages/Signup";
import { Signin } from "@/pages/Signin";
import { ConfirmEmail } from "@/pages/ConfirmEmail";
import { Category } from "@/pages/Category";
import { Settings } from "@/pages/Settings";
import { Profile } from "@/pages/Profile";

import "./CSS/output.css";

export default function App() {
  const { token } = useLocalStorageToken();
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return setUser(null);

    fetch("https://arabian-odyssey.vercel.app/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: `ArabianOdyssey__${token}`,
      },
    })
      .then((res) => res.json())
      .then((data: { message: string; user: User; err?: string }) => {
        if (data.message === "success") {
          setUser(data.user);
          setIsLoading(false);
        }
      })
      .catch((err) => console.log(err));
  }, [setUser, token]);

  return (
    <Routes>
      <Route path="/" element={<Layout loading={isLoading} />}>
        <Route index element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/category/:category" element={<Category />} />
      </Route>
      <Route path="/confirm-email" element={<ConfirmEmail />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
}
