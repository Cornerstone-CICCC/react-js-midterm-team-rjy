import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  // 장바구니 데이터를 가져와서 총 수량(또는 품목 수) 계산
  async function fetchCartCount() {
    try {
      const res = await fetch("http://localhost:3000/api/cart");
      if (res.ok) {
        const data = await res.json();
        // 품목의 종류 수를 보여주고 싶으면 data.length, 
        // 총 상품 개수를 보여주고 싶으면 reduce를 사용하세요.
        setCartCount(Array.isArray(data) ? data.length : 0);
      }
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  }

  useEffect(() => {
    fetchCartCount();
    // 다른 페이지 이동이나 상태 변경 시 대응하기 위해 
    // 실제 서비스에서는 Context API나 Redux를 쓰는 게 좋지만, 
    // 현재 구조에서는 마운트될 때마다 가져오도록 설정했습니다.
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

      {/* Cart (배지 추가됨) */}
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

      {/* Favorites */}
      <button
        onClick={() => navigate("/checkout")}
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