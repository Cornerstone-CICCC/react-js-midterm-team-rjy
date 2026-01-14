import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BottomNav from "./BottomNav";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullname: "Loading...",
    email: "Loading...",
    address: "Loading...",
  });

  const [loading, setLoading] = useState(true);

  async function fetchUserProfile() {
    try {
      const response = await fetch("http://localhost:3000/users/profile", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user profile");
      }
      setUser({
        fullname: data.user.fullname,
        email: data.user.email,
        address: data.user.address || "No address provided",
      });
      setLoading(false);
    }catch(error){
      console.error("Error fetching user profile:", error);
      navigate("/signin");
    }
  }

  useEffect(() => {
    fetchUserProfile();
  }, []);

async function handleLogout() {
  try {
    await fetch("http://localhost:3000/users/logout", {
      method: "POST",
      credentials: "include",
    });

    navigate("/signin");
  } catch (error) {
    console.error("Logout error:", error);
  }
}


  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-between pt-16 pb-6 px-6 relative">

      <button
        onClick={() => navigate("/shop")}
        className="absolute left-4 top-4 p-2 rounded-full hover:bg-slate-100 transition"
      >
        <img
          src="/assets/arrow_back_icon.svg"
          alt="Back"
          className="w-6 h-6 opacity-80"
        />
      </button>

      <div className="flex flex-col items-center">
        <img
          src="/assets/logo.svg"
          alt="Fashion Boutique Logo"
          className="w-28 h-28 object-contain mb-2"
        />
      </div>

      <h1 className="text-center text-[32px] font-semibold leading-tight font-[Lora]">
        Your Profile
      </h1>

      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mt-6">
        <div className="mb-4">
          <p className="text-sm text-slate-500">Full Name</p>
          <p className="text-[16px] font-medium text-slate-900 mt-1">
            {user.fullname}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-slate-500">Email</p>
          <p className="text-[16px] font-medium text-slate-900 mt-1">
            {user.email}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Address</p>
          <p className="text-[16px] font-medium text-slate-900 mt-1">
            {user.address}
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3 mt-8">
        <button
          onClick={() => navigate("/edit-profile")}
          className="w-full rounded-xl border border-slate-900 px-4 py-3 text-slate-900 text-[15px] font-medium hover:bg-slate-100 transition"
        >
          Edit Profile
        </button>

        <button
          onClick={handleLogout}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white text-[15px] font-medium shadow-sm hover:bg-slate-800 transition"
        >
          Logout
        </button>
      </div>
      <BottomNav />
      <div className="h-1 w-28 rounded-full bg-slate-300 mt-8" />
    </div>
  );
}
