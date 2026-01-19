import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; 

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
}

type Status = "loading" | "success" | "error";

const LS_KEY = "favorites_product_ids";

function loadFavIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveFavIds(set: Set<string>) {
  localStorage.setItem(LS_KEY, JSON.stringify(Array.from(set)));
}

export default function Favorites() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [favIds, setFavIds] = useState<Set<string>>(() => loadFavIds());

  useEffect(() => {
    const load = async () => {
      try {
        setStatus("loading");
        const res = await fetch("http://localhost:3000/api/products");
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        setAllProducts(data);
        setStatus("success");
      } catch (e) {
        setStatus("error");
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    };
    load();
  }, []);

  const favoriteProducts = useMemo(
    () => allProducts.filter((p) => favIds.has(p._id)),
    [allProducts, favIds]
  );

  const toggleFavorite = (productId: string) => {
    setFavIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        console.log("Removed from wishlist");
      } else {
        next.add(productId);
        console.log("Added to wishlist! ❤️");
      }
      saveFavIds(next);
      return next;
    });
  };

  const addToCart = async (productId: string) => {
    try {
      const res = await fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (res.ok) {
        console.log("Added to cart!");
      } else {
        throw new Error();
      }
    } catch {
      console.log("Failed to add to cart");
    }
  };

  if (status === "loading") return <div className="p-10 text-center font-['Lora']">Loading...</div>;

  return (
    <div className="bg-white min-h-screen pb-24 font-['Lora'] serif overflow-x-hidden">
      
      {/* 대화면 대응을 위한 중앙 정렬 컨테이너 (최대 너비 1200px) */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        
        {/* Header: 상품 리스트(/shop) 이동 버튼과 타이틀 */}
        <header className="py-8 lg:py-14 flex items-center justify-between">
          <button onClick={() => navigate('/shop')} className="text-xl lg:text-3xl hover:opacity-50 transition-opacity">
            <i className="fa-solid fa-chevron-left" />
          </button>
          <h1 className="text-[20px] lg:text-[32px] font-black uppercase tracking-tight">Wishlist</h1>
          <div className="w-6 lg:w-10" /> {/* balance */}
        </header>

        {favoriteProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 lg:pt-40 text-gray-400">
            <i className="fa-regular fa-heart text-5xl lg:text-8xl mb-6 opacity-20" />
            <p className="text-[16px] lg:text-[20px]">Your wishlist is empty.</p>
            <button 
              onClick={() => navigate('/shop')}
              className="mt-6 px-8 py-3 bg-black text-white rounded-full text-sm font-bold"
            >
              Go Shopping
            </button>
          </div>
        ) : (
          /* Products 그리드: 모바일 2열 / 데스크탑 4열 고정 */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 lg:gap-x-10 gap-y-10 lg:gap-y-20">
            {favoriteProducts.map((p) => (
              <div key={p._id} className="relative group">
                {/* 이미지 카드 - 굴곡 및 호버 효과 */}
                <div 
                  className="relative aspect-[3/4] rounded-[20px] lg:rounded-[30px] overflow-hidden bg-gray-50 mb-4 cursor-pointer shadow-sm transition-transform duration-500 group-hover:-translate-y-2"
                >
                  <img 
                    src={p.imageUrl} 
                    className="w-full h-full object-cover" 
                    alt={p.name} 
                    onClick={() => navigate(`/product/${p._id}`)}
                  />
                  
                  {/* 하트 버튼 - 상단 우측 고정 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(p._id);
                    }}
                    className="absolute top-3 right-3 lg:top-5 lg:right-5 w-8 h-8 lg:w-10 lg:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                  >
                    <i className="fa-solid fa-heart text-red-500 text-sm lg:text-lg" />
                  </button>
                </div>

                {/* 가격 및 이름 정보 */}
                <div className="px-1">
                  <div className="text-[17px] lg:text-[22px] font-black text-black mb-1">
                    ${p.price.toFixed(2)}
                  </div>
                  <div className="text-[13px] lg:text-[16px] text-gray-500 font-medium line-clamp-1 mb-4 group-hover:text-black transition-colors">
                    {p.name}
                  </div>

                  {/* Add to Cart 버튼 */}
                  <button
                    onClick={() => addToCart(p._id)}
                    className="w-full py-3 lg:py-4 rounded-[12px] lg:rounded-[15px] bg-black text-white text-[12px] lg:text-[14px] font-bold active:scale-95 transition-all hover:bg-gray-800"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 하단 여백 */}
        <div className="h-20 lg:h-40" />
      </div>
    </div>
  );
}