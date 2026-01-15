import { useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigate, useParams } from "react-router-dom";

import ProductsList from "./pages/ProductsList";
import ProductDetail from "./pages/ProductsDetail";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";

import SearchModal, { type SearchProduct } from "./components/SearchModal";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/shop" replace />} />

      <Route path="/shop" element={<ShopPage />} />
      <Route path="/shop/:id" element={<ProductDetailRoute />} />

      <Route path="/cart" element={<CartPage />} />
      <Route path="/likes" element={<FavoritesPage />} />

      <Route path="*" element={<Navigate to="/shop" replace />} />
    </Routes>
  );
}

/** 공통: 검색용 products 미리 로드 */
function useSearchProducts() {
  const [products, setProducts] = useState<SearchProduct[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = (await res.json()) as SearchProduct[];
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  return products;
}

/** 공통: 헤더(좌측/중앙/우측) */
function PageHeader({
  title,
  left,
  right,
}: {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="w-10">{left}</div>
        <h1 className="text-[20px] font-semibold tracking-wide">{title}</h1>
        <div className="flex items-center gap-3">{right}</div>
      </div>
    </header>
  );
}

/** /shop */
function ShopPage() {
  const navigate = useNavigate();

  // search
  const products = useSearchProducts();
  const [searchOpen, setSearchOpen] = useState(false);

  // toast (기존 토스트를 App에서 관리하던 흐름이 있었다면 여기서 확장하면 됨)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999]">
          <div
            className={`px-4 py-3 rounded-xl shadow text-white text-[13px] font-semibold ${
              toast.type === "success" ? "bg-black" : "bg-red-600"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      <PageHeader
        title="Shopping App"
        right={
          <>
            {/* 🔍 search */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="search"
              className="w-10 h-10 grid place-items-center rounded-xl hover:bg-black/5"
            >
              <i className="fa-solid fa-magnifying-glass text-xl" />
            </button>

            {/* ❤️ favorites */}
            <button
              onClick={() => navigate("/likes")}
              aria-label="likes"
              className="w-10 h-10 grid place-items-center rounded-xl hover:bg-black/5"
            >
              <i className="fa-regular fa-heart text-xl" />
            </button>

            {/* 🛒 cart */}
            <button
              onClick={() => navigate("/cart")}
              aria-label="cart"
              className="w-10 h-10 grid place-items-center rounded-xl hover:bg-black/5"
            >
              <i className="fa-solid fa-cart-shopping text-xl" />
            </button>
          </>
        }
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <ProductsList
          onSelectProduct={(id) => navigate(`/shop/${id}`)}
          onAddedToCart={() => showToast("Added to cart!", "success")}
        />
      </main>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={products}
        onSelect={(id) => navigate(`/shop/${id}`)}
      />
    </div>
  );
}

/** /shop/:id */
function ProductDetailRoute() {
  const navigate = useNavigate();
  const { id } = useParams();

  // search
  const products = useSearchProducts();
  const [searchOpen, setSearchOpen] = useState(false);

  if (!id) return <Navigate to="/shop" replace />;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 디테일 페이지는 너가 “헤더 숨기기” 원해서 유지: 헤더 없음 */}
      {/* 대신 검색이 꼭 필요하면 여기서만 tiny 버튼을 만들 수도 있지만,
         지금 요구는 Shop/Cart/Likes 우상단 검색이었으니 detail은 건드리지 않음 */}

      <main className="max-w-7xl mx-auto px-6 py-0">
        <ProductDetail
          productId={id}
          onBack={() => navigate("/shop")}
          onAddedToCart={() => {
            // 필요하면 cart로 보내거나 토스트 추가 연결 가능
          }}
          onAddToCartFailed={() => {
            // 필요하면 토스트 연결 가능
          }}
        />
      </main>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={products}
        onSelect={(pid) => navigate(`/shop/${pid}`)}
      />
    </div>
  );
}

/** /cart */
function CartPage() {
  const navigate = useNavigate();

  // search
  const products = useSearchProducts();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ 여기서 PageHeader 제거! (Cart.tsx 안에 이미 피그마 topbar가 있음) */}
      <Cart
        onBack={() => navigate("/shop")}
        onOpenSearch={() => setSearchOpen(true)} // Cart 상단 돋보기에서 열기(아래 설명)
      />

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={products}
        onSelect={(id) => navigate(`/shop/${id}`)}
      />
    </div>
  );
}


/** /likes */
function FavoritesPage() {
  const navigate = useNavigate();

  // search
  const products = useSearchProducts();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <PageHeader
        title="Favorites"
        left={
          <button
            onClick={() => navigate("/shop")}
            aria-label="back"
            className="w-10 h-10 grid place-items-center rounded-xl hover:bg-black/5"
          >
            <i className="fa-solid fa-chevron-left text-xl" />
          </button>
        }
        right={
          <>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="search"
              className="w-10 h-10 grid place-items-center rounded-xl hover:bg-black/5"
            >
              <i className="fa-solid fa-magnifying-glass text-xl" />
            </button>
          </>
        }
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Favorites onSelectProduct={(id) => navigate(`/shop/${id}`)} />
      </main>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={products}
        onSelect={(id) => navigate(`/shop/${id}`)}
      />
    </div>
  );
}
