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
  onSelectProduct: (id: string) => void;
  onAddedToCart?: () => void; // (지금 페이지에선 버튼 없음, 필요하면 나중에 추가)
}

const LS_KEY = "favorites_product_ids";

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

const CATEGORIES = ["All", "Tops", "Bottoms", "Outerwear", "Dresses"] as const;
type Category = (typeof CATEGORIES)[number];

// ✅ 간단 키워드 필터(백엔드에 category 없으니까 이름/설명 기반으로 가볍게)
function matchCategory(p: Product, cat: Category) {
  if (cat === "All") return true;

  const text = `${p.name} ${p.description ?? ""}`.toLowerCase();

  if (cat === "Tops") return /(top|shirt|tee|blouse|hoodie|sweater)/.test(text);
  if (cat === "Bottoms") return /(bottom|pants|trouser|jean|skirt)/.test(text);
  if (cat === "Outerwear") return /(outer|coat|jacket|cardigan)/.test(text);
  if (cat === "Dresses") return /(dress|gown)/.test(text);

  return true;
}

export default function ProductsList({ onSelectProduct }: Props) {
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string>("");

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category>("All");

  const [favIds, setFavIds] = useState<Set<string>>(() => loadFavIds());

  // products load
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
        setProducts(data);
        setStatus("success");
      } catch (e) {
        setStatus("error");
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    };

    load();
  }, []);

  // localStorage sync (optional)
  useEffect(() => {
    const onStorage = () => setFavIds(loadFavIds());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => matchCategory(p, category));
  }, [products, category]);

  const toggleFavorite = (productId: string) => {
    setFavIds((prev) => {
      const next = new Set(prev);
      const isAdding = !next.has(productId);

      if (isAdding) next.add(productId);
      else next.delete(productId);

      saveFavIds(next);

      // ✅ App.tsx 토스트(이벤트 방식)
      window.dispatchEvent(
        new CustomEvent("app:toast", {
          detail: {
            message: isAdding ? "Added to favorites ❤️" : "Removed from favorites",
            type: isAdding ? "success" : "info",
          },
        })
      );

      return next;
    });
  };

  // ===== UI =====
  if (status === "loading") {
    return (
      <div className="px-4">
        {/* category chips skeleton */}
        <div className="flex gap-3 overflow-x-auto py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-6 w-14 bg-black/10 rounded-full" />
          ))}
        </div>

        {/* grid skeleton */}
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="w-full aspect-[3/4] rounded-[12px] bg-black/10" />
              <div className="mt-2 h-3 w-16 bg-black/10 rounded" />
              <div className="mt-2 h-3 w-40 bg-black/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="px-4 text-sm text-red-600">
        <div>Could not load products.</div>
        <pre className="mt-2 text-xs whitespace-pre-wrap text-black/70">{error}</pre>
      </div>
    );
  }

  return (
    <div className="px-4">
      {/* ✅ Category chips (스샷처럼 상단) */}
      <div className="flex items-center gap-4 overflow-x-auto py-2">
        {CATEGORIES.map((c) => {
          const active = c === category;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={[
                "text-[12px] whitespace-nowrap",
                active ? "text-black font-semibold" : "text-black/40 font-medium",
              ].join(" ")}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* ✅ 2열 카드 그리드 (스샷 그대로) */}
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-6">
        {filtered.map((p) => {
          const liked = favIds.has(p._id);

          return (
            <div key={p._id} className="select-none">
              {/* 이미지 카드 (클릭=디테일) */}
              <button
                type="button"
                onClick={() => onSelectProduct(p._id)}
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

              {/* 가격 + 하트 (스샷처럼 같은 줄) */}
              <div className="mt-2 flex items-center justify-between">
                <div className="text-[12px] text-black/70">
                  {p.price.toFixed(2)}$
                </div>

                <button
                  type="button"
                  aria-label="toggle favorite"
                  onClick={(e) => {
                    e.stopPropagation(); // ✅ 카드 클릭(디테일 이동) 방지
                    toggleFavorite(p._id);
                  }}
                  className="w-8 h-8 grid place-items-center"
                >
                  <i
                    className={`${liked ? "fa-solid" : "fa-regular"} fa-heart text-[16px] text-black/70`}
                  />
                </button>
              </div>

              {/* 상품명 (2줄) */}
              <div className="mt-1 text-[12px] leading-snug text-black/70 line-clamp-2">
                {p.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
