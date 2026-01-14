import { useNavigate } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();

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
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-md py-3 px-6 flex justify-between items-center z-50">

        <button
        onClick={handleLogout}
        className="flex flex-col items-center text-red-600 hover:text-red-800"
        >
        <img src="/assets/logout_icon.svg" className="w-6 h-6" />
      </button>

      <button
        onClick={() => navigate("/shop")}
        className="flex flex-col items-center text-slate-700 hover:text-slate-900"
      >
        <img src="/assets/menu_icon.svg" className="w-6 h-6" />
      </button>

      <button
        onClick={() => navigate("/cart")}
        className="flex flex-col items-center text-slate-700 hover:text-slate-900"
      >
        <img src="/assets/shopping_cart_icon.svg" className="w-6 h-6" />
      </button>

      <button
        onClick={() => navigate("/likes")}
        className="flex flex-col items-center text-slate-700 hover:text-slate-900"
      >
        <img src="/assets/favorite_icon.svg" className="w-6 h-6" />
      </button>

      <button
        onClick={() => navigate("/profile")}
        className="flex flex-col items-center text-slate-700 hover:text-slate-900"
      >
        <img src="/assets/name_icon.svg" className="w-6 h-6" />
      </button>

    </div>
  );
}
