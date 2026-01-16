import { useEffect, useMemo, useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
}

type Status = "loading" | "success" | "error";

interface Props {
  onSelectProduct?: (id: string) => void;
  onAddedToCart?: () => void;
}

const LS_KEY = "favorites_product_ids";

/* =========================
   localStorage helpers
========================= */
function loadFavIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const arr = raw ? (JSON.parse(raw) as string[]) : [];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function saveFavIds(set: Set<string>) {
  localStorage.setItem(LS_KEY, JSON.stringify(Array.from(set)));
}

/* =========================
   Favorites Page
========================= */
export default function Favorites({ onSelectProduct, onAddedToCart }: Props) {
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [favIds, setFavIds] = useState<Set<string>>(() => loadFavIds());

  /* fetch all products */
  useEffect(() => {
    const load = async () => {
      try {
        setStatus("loading");
        setError("");

        const res = await fetch("http://localhost:3000/api/products", {
          credentials: "include",
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status} - ${text}`);
        }

        const data = (await res.json()) as Product[];
        setAllProducts(data);
        setStatus("success");
      } catch (e) {
        setStatus("error");
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    };

    load();
  }, []);

  /* sync favorites across tabs */
  useEffect(() => {
    const onStorage = () => setFavIds(loadFavIds());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* filter favorites */
  const favoriteProducts = useMemo(
    () => allProducts.filter((p) => favIds.has(p._id)),
    [allProducts, favIds]
  );

  /* toggle heart */
  const toggleFavorite = (productId: string) => {
    setFavIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      saveFavIds(next);
      return next;
    });
  };

  /* add to cart */
  const addToCart = async (productId: string) => {
    const res = await fetch("http://localhost:3000/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId, quantity: 1 }),
    });

    if (!res.ok) {
      const t = await res.text();
      throw new Error(t || "Failed to add to cart");
    }

    onAddedToCart?.();
  };

  /* =========================
     Render states
  ========================= */
  if (status === "loading") {
    return <p className="text-sm text-black/60">Loading…</p>;
  }

  if (status === "error") {
    return (
      <div className="text-sm text-red-600">
        <div>Could not load favorites.</div>
        <pre className="mt-2 text-xs whitespace-pre-wrap text-black/70">
          {error}
        </pre>
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return <div className="text-sm text-black/60">No favorites yet.</div>;
  }

  /* =========================
     Grid + Card (통합)
  ========================= */
  return (
    <div className="px-4">
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        {favoriteProducts.map((p) => {
          const liked = favIds.has(p._id);

          return (
            <div key={p._id} className="select-none">
              {/* 이미지 카드 */}
              <button
                type="button"
                onClick={() => onSelectProduct?.(p._id)}
                className="w-full rounded-[12px] overflow-hidden bg-black/5 border border-black/10"
              >
                <div className="aspect-[3/4] w-full bg-black/5">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </button>

              {/* 가격 + 하트 */}
              <div className="mt-2 flex items-center justify-between">
                <div className="text-[12px] text-black/60">
                  {p.price.toFixed(2)}$
                </div>

                <button
                  type="button"
                  aria-label="toggle favorite"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(p._id);
                  }}
                  className="w-8 h-8 grid place-items-center rounded-full hover:bg-black/5"
                >
                  <i
                    className={`${
                      liked ? "fa-solid" : "fa-regular"
                    } fa-heart`}
                  />
                </button>
              </div>

              {/* 상품명 */}
              <div className="mt-1 text-[12px] leading-snug text-black/70 line-clamp-2">
                {p.name}
              </div>

              {/* Add to cart */}
              <button
                type="button"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    await addToCart(p._id);
                  } catch (err) {
                    console.error(err);
                    alert("Add to cart failed");
                  }
                }}
                className="mt-2 w-full h-9 rounded-[10px] bg-black text-white text-[12px] font-semibold flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-cart-shopping" />
                Add to cart
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
