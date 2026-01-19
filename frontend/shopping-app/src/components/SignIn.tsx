import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { FormEvent } from "react";
export default function Signin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try{
      const response = await fetch("http://localhost:3000/users/login", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
      })
      const data = await response.json();
      if(!response.ok){
          throw new Error(data.message || "Failed to sign in");
          return;
      }
      console.log("User signed in successfully:", data);
      navigate("/shop");
    }catch(error){
      console.error("Error during sign in:", error);
      return;
    }
    
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-between pt-16 pb-6 px-6">

      <div className="flex flex-col items-center">
        <img
          src="/assets/logo.svg"
          alt="Fashion Boutique Logo"
          className="w-30 h-30 object-contain mb-2"
        />
      </div>

      <h1 className="text-center text-[32px] font-semibold leading-tight font-[Lora]">
        Enter Your Account
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-5 mt-8"
      >
        <div className="flex flex-col w-full">
          <label className="text-sm text-slate-700 mb-1">Email</label>

          <div className="relative w-full">
            <img
              src="/assets/email_icon.svg"
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
            />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label className="text-sm text-slate-700 mb-1">Password</label>

          <div className="relative w-full">
            <img
              src="/assets/password_icon.svg"
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
            />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700 mt-1">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-4 h-4 rounded border-slate-400"
          />
          Remember me
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-slate-900 px-4 py-4 text-white text-[15px] font-medium shadow-sm hover:bg-slate-800 transition mt-2"
        >
          Sign in
        </button>
      </form>

      <p className="mt-6 text-[14px] text-slate-600">
        Don’t have an account{" "}
        <button
          onClick={() => navigate("/signup")}
          className="underline font-medium text-slate-900 hover:text-slate-700"
        >
          Sign up
        </button>
      </p>

      <div className="h-1 w-28 rounded-full bg-slate-300 mt-8" />
    </div>
  );
}
