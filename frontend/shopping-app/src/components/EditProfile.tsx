import { useNavigate } from "react-router-dom";
import { useEffect, useState,  type FormEvent } from "react";
import BottomNav from "./BottomNav";

export default function EditProfile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchUpdateProfile() {
    try{
      const response = await fetch("http://localhost:3000/users/profile", {
        method: "GET",
        credentials: "include",
      });
      if(response.status === 401){
        navigate("/signin");
        return;
      }
      const data = await response.json();

      setName(data.user.fullname || "");
      setEmail(data.user.email || "");
      setAddress(data.user.address || "");

      setLoading(false);

    }catch(error){
      console.error("Error fetching user profile:", error);
      navigate("/signin");
      return;
    }
  }

  useEffect(() => {
    fetchUpdateProfile();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try{
      const response = await fetch("http://localhost:3000/users/update-profile", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname: name, email, address }),
      });
      const data = await response.json();
      if(!response.ok){
          throw new Error(data.message || "Failed to update profile");
          return;
      }
      navigate("/profile");

    }catch(error){
      console.error("Error updating profile:", error);
      return;
    }

  }

  if (loading) { 
    return ( <div className="min-h-screen flex items-center justify-center text-slate-700"> Loading... </div> 

    ); 
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-between pt-16 pb-6 px-6 relative">

      <button
        onClick={() => navigate("/profile")}
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
        Edit Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-5 mt-8"
      >
        <div className="flex flex-col w-full">
          <label className="text-sm text-slate-700 mb-1">Full Name</label>
          <div className="relative w-full">
            <img
              src="/assets/name_icon.svg"
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-300 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label className="text-sm text-slate-700 mb-1">Email</label>
          <div className="relative w-full">
            <img
              src="/assets/email_icon.svg"
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label className="text-sm text-slate-700 mb-1">Address</label>
          <div className="relative w-full">
            <img
              src="/assets/edit_location_icon.svg"
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
            />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-slate-300 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white text-[15px] font-medium shadow-sm hover:bg-slate-800 transition"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-full rounded-xl border border-slate-900 px-4 py-3 text-slate-900 text-[15px] font-medium hover:bg-slate-100 transition"
          >
            Cancel
          </button>
        </div>
      </form>
      <BottomNav />
      <div className="h-1 w-28 rounded-full bg-slate-300 mt-8" />
    </div>
  );
}
