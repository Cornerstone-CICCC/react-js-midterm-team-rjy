import { useNavigate } from "react-router-dom";

export default function Confirmation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-between pt-20 pb-6 px-6">

      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg
            className="w-14 h-14 text-emerald-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-center text-[32px] font-semibold leading-tight font-[Lora] mt-6">
          Payment Successful!
        </h1>

        <p className="text-center text-[15px] text-slate-600 mt-2 px-4">
          Order number: <br />
          Thank you for your shopping.
        </p>
      </div>

      <button
        onClick={() => navigate("/shop")}
        className="w-full max-w-sm rounded-xl bg-slate-900 px-4 py-4 text-white text-[15px] font-medium shadow-sm hover:bg-slate-800 transition"
      >
        Continue
      </button>

      <div className="h-1 w-28 rounded-full bg-slate-300" />
    </div>
  );
}