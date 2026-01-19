import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; 

export default function BottomNav() {
  const navigate = useNavigate();
  const { cartItems } = useCart();  
  const cartCount = cartItems.length;  

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
      
      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center text-red-600 hover:text-red-800"
      >
        <img src="/assets/logout_icon.svg" className="w-6 h-6" alt="Logout" />
      </button>

      {/* Shop */}
      <button
        onClick={() => navigate("/shop")}
        className="flex flex-col items-center text-slate-700 hover:text-slate-900"
      >
        <img src="/assets/menu_icon.svg" className="w-6 h-6" alt="Menu" />
      </button>

      {/* Cart */}
      <button
        onClick={() => navigate("/cart")}
        className="relative flex flex-col items-center text-slate-700 hover:text-slate-900"
      >
        <img src="/assets/shopping_cart_icon.svg" className="w-6 h-6" alt="Cart" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-white">
            {cartCount}
          </span>
        )}
      </button>

      {/* Favorites (경로 수정 완료: /checkout -> /likes) */}
      <button
        onClick={() => navigate("/likes")}
        className="flex flex-col items-center text-slate-700 hover:text-slate-900"
      >
        <img src="/assets/favorite_icon.svg" className="w-6 h-6" alt="Favorite" />
      </button>

      {/* Profile */}
      <button
        onClick={() => navigate("/profile")}
        className="flex flex-col items-center text-slate-700 hover:text-slate-900"
      >
        <img src="/assets/name_icon.svg" className="w-6 h-6" alt="Profile" />
      </button>

    </div>
  );
}