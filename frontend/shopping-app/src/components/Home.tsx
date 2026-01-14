import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-between pt-20 pb-6 px-6">
        
      <div className="w-full max-w-sm flex flex-col items-center">
        <img
          src="/assets/logo.svg"
          alt="Fashion Boutique Logo"
          className="w-40 h-40 object-contain" 
        />
        <h1 className="text-center text-[38px] font-semibold leading-tight px-6 font-[Lora] mt-2 mb-8">
            Welcome to Fashion Boutique
        </h1>
        <button
          onClick={() => navigate("/signin")}
          className="w-full rounded-xl bg-slate-900 px-4 py-4 text-white text-[15px] font-medium shadow-sm hover:bg-slate-800 transition"
        >
          Sign in with password
        </button>

        <p className="mt-4 text-[14px] text-slate-600">
          Don’t have an account{" "}
          <button
            onClick={() => navigate("/signup")}
            className="underline font-medium text-slate-900 hover:text-slate-700"
          >
            Sign up
          </button>
        </p>
      </div>

      <div className="h-1 w-28 rounded-full bg-slate-300" />
    </div>
  );
}
