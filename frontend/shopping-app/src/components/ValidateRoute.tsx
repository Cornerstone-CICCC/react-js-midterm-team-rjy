import { Navigate } from "react-router-dom";
import { useEffect, useState, type JSX } from "react";

export default function ValidateRoute({ children }: { children: JSX.Element }) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("http://localhost:3000/users/profile", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch {
        setIsAuth(false);
      }
    }

    checkAuth();
  }, []);

  if (isAuth === null) {
    return <div className="p-10 text-center">Checking session...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
