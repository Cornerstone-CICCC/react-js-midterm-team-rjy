import { useEffect, useMemo, useState } from "react";

type Product = {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  // 옵션 필드(없어도 됨)
  category?: string;
};

type Props = {
  productId: string;
  onBack: () => void;
  onAddedToCart?: () => void;
  onAddToCartFailed?: () => void;
};

function normalizeText(s: string) {
  return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function tokenize(s: string) {
  return normalizeText(s)
    .split(" ")
    .filter((w) => w.length >= 3)
    .slice(0, 12);
}

function scoreSimilar(a: Product, b: Product) {
  let score = 0;
  if (a.category && b.category && a.category === b.category) score += 3;

  const aTokens = new Set([...tokenize(a.name), ...tokenize(a.description ?? "")]);
  const bTokens = new Set([...tokenize(b.name), ...tokenize(b.description ?? "")]);

  let overlap = 0;
  aTokens.forEach((t) => {
    if (bTokens.has(t)) overlap += 1;
  });

  score += overlap;
  return score;
}

export default function ProductDetail({
  productId,
  onBack,
  onAddedToCart,
  onAddToCartFailed,
}: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string>("");

  const [qty, setQty] = useState<number>(1);
  const [isLiked, setIsLiked] = useState(false);

  const [descOpen, setDescOpen] = useState(true);
  const [reviewsOpen, setReviewsOpen] = useState(false);

  // ========== Load product detail ==========
  useEffect(() => {
    const loadDetail = async () => {
      try {
        setStatus("loading");
        setError("");

        const res = await fetch(`http://localhost:3000/api/products/${productId}`, {
          credentials: "include",
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`GET /api/products/:id failed (HTTP ${res.status})\n${text}`);
        }

        const data = (await res.json()) as Product;
        setProduct(data);
        setStatus("success");
      } catch (e) {
        console.error(e);
        setStatus("error");
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    };

    loadDetail();
  }, [productId]);

  // ========== Load all products (for Similar / Love) ==========
  useEffect(() => {
    const loadAll = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = (await res.json()) as Product[];
        setAllProducts(Array.isArray(data) ? data : []);
      } catch {
        // ignore
      }
    };

    loadAll();
  }, []);

  const addToCart = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity: qty }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t);
      }
      onAddedToCart?.();
    } catch (e) {
      console.error(e);
      onAddToCartFailed?.();
    }
  };

  const { similarProducts, loveProducts } = useMemo(() => {
    if (!product || allProducts.length === 0) {
      return { similarProducts: [] as Product[], loveProducts: [] as Product[] };
    }

    const others = allProducts.filter((p) => p._id !== product._id);

    const scored = others
      .map((p) => ({ p, s: scoreSimilar(product, p) }))
      .sort((a, b) => b.s - a.s)
      .map((x) => x.p);

    const similar = scored.slice(0, 10);

    const target = product.price;
    const near = others
      .filter((p) => !similar.some((sp) => sp._id === p._id))
      .sort((a, b) => Math.abs(a.price - target) - Math.abs(b.price - target));

    const pool = near.slice(0, 20);
    const shuffled = [...pool].sort(() => (Math.random() > 0.5 ? 1 : -1));
    const love = shuffled.slice(0, 10);

    return { similarProducts: similar, loveProducts: love };
  }, [product, allProducts]);

  if (status === "loading") {
    return <div className="px-4 py-8 text-sm text-black/60">Loading product...</div>;
  }

  if (status === "error" || !product) {
    return (
      <div className="px-4 py-8">
        <div className="text-red-600 font-semibold">Failed to load product.</div>
        <pre className="mt-2 text-xs whitespace-pre-wrap text-black/60">{error}</pre>
        <button
          className="mt-4 h-10 px-4 rounded-xl border border-black/15 bg-white hover:bg-black/5"
          onClick={onBack}
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="pb-10">
      {/* =====================
          IMAGE (full-bleed) + OVERLAY ICONS (겹치기)
          - 스샷처럼 이미지 위에 back / share
      ====================== */}
      <div className="w-screen relative left-1/2 -translate-x-1/2">
        <div className="relative w-full bg-black/5">
          {/* 이미지 */}
          <div className="aspect-[3/4] w-full">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* ✅ overlay: back */}
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="absolute top-3 left-3 w-10 h-10 grid place-items-center rounded-full text-black hover:bg-white/25"
          >
            <i className="fa-solid fa-chevron-left" />
          </button>

          {/* ✅ overlay: share */}
          <button
            type="button"
            aria-label="Share"
            onClick={() => {
              // TODO: 진짜 공유는 나중에
              alert("Share clicked");
            }}
            className="absolute top-3 right-3 w-10 h-10 grid place-items-center rounded-full text-black hover:bg-white/25"
          >
            <i className="fa-solid fa-share-nodes" />
          </button>
        </div>
      </div>

      {/* =====================
          CONTENT
      ====================== */}
      <div className="px-4">
        {/* NAME + HEART (same row) */}
        <div className="mt-4 flex items-start justify-between gap-3">
          <h2 className="text-[16px] font-semibold text-black/90 leading-snug">
            {product.name}
          </h2>

          <button
            type="button"
            onClick={() => setIsLiked((v) => !v)}
            className="w-10 h-10 grid place-items-center rounded-full hover:bg-black/5"
            aria-label="Like"
          >
            <i className={`${isLiked ? "fa-solid" : "fa-regular"} fa-heart`} />
          </button>
        </div>

        {/* STAR + PRICE (same row) */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1 text-black/70 text-[12px]">
            <i className="fa-solid fa-star" />
            <span>4.8</span>
            <span className="text-black/40">(1,234)</span>
          </div>

          <div className="text-[14px] font-semibold text-black">
            {product.price.toFixed(2)}$
          </div>
        </div>

        {/* QTY */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-[12px] text-black/60">Quantity</div>

          <div className="h-10 w-[120px] rounded-xl border border-black/10 bg-white flex items-center justify-between px-2">
            <button
              type="button"
              className="w-8 h-8 rounded-lg hover:bg-black/5"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Minus"
            >
              −
            </button>

            <div className="text-[12px] font-semibold text-black/80">{qty}</div>

            <button
              type="button"
              className="w-8 h-8 rounded-lg hover:bg-black/5"
              onClick={() => setQty((q) => q + 1)}
              aria-label="Plus"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to cart */}
        <button
          type="button"
          onClick={addToCart}
          className="mt-4 w-full h-12 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-cart-shopping" />
          Add to cart
        </button>

        {/* Description accordion */}
        <div className="mt-6 border-t border-black/10 pt-4">
          <button
            type="button"
            onClick={() => setDescOpen((v) => !v)}
            className="w-full flex items-center justify-between"
          >
            <span className="text-[13px] font-semibold text-black/80">
              Description
            </span>
            <i className={`fa-solid ${descOpen ? "fa-angle-up" : "fa-angle-down"}`} />
          </button>

          {descOpen && (
            <p className="mt-3 text-[12px] leading-relaxed text-black/60">
              {product.description ?? "No description yet."}
            </p>
          )}
        </div>

        {/* Reviews accordion */}
        <div className="mt-4 border-t border-black/10 pt-4">
          <button
            type="button"
            onClick={() => setReviewsOpen((v) => !v)}
            className="w-full flex items-center justify-between"
          >
            <span className="text-[13px] font-semibold text-black/80">
              Customer reviews
            </span>
            <i className={`fa-solid ${reviewsOpen ? "fa-angle-up" : "fa-angle-down"}`} />
          </button>

          {reviewsOpen && (
            <div className="mt-3 text-[12px] text-black/60">
              <p>Reviews section (placeholder)</p>
            </div>
          )}
        </div>
      </div>

      {/* =====================
          SLIDER SECTION UI (Figma-like)
          - 상품명/가격/하트/여백
          - 좌우 스크롤
      ====================== */}
      <div className="mt-8 px-4">
        <h3 className="text-[13px] font-semibold text-black/80">Similar products</h3>

        <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar">
          {similarProducts.map((p) => (
            <SliderCard
              key={p._id}
              product={p}
              onClick={() => {
                alert("Hook this to open another detail: " + p._id);
              }}
            />
          ))}
          {similarProducts.length === 0 && (
            <div className="text-xs text-black/40 py-4">No similar products.</div>
          )}
        </div>
      </div>

      <div className="mt-8 px-4">
        <h3 className="text-[13px] font-semibold text-black/80">We think you'll love</h3>

        <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar">
          {loveProducts.map((p) => (
            <SliderCard
              key={p._id}
              product={p}
              onClick={() => alert("Hook this to open another detail: " + p._id)}
            />
          ))}
          {loveProducts.length === 0 && (
            <div className="text-xs text-black/40 py-4">No suggestions yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function SliderCard({
  product,
  onClick,
}: {
  product: Product;
  onClick?: () => void;
}) {
  const [liked, setLiked] = useState(false);

  return (
    <div
      className="min-w-[150px] max-w-[150px]"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick?.();
      }}
    >
      {/* 이미지 */}
      <div className="relative rounded-[14px] overflow-hidden bg-black/5 border border-black/10">
        <div className="aspect-[3/4] w-full">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 하트 */}
        <button
          type="button"
          className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 grid place-items-center border border-black/5"
          onClick={(e) => {
            e.stopPropagation();
            setLiked((v) => !v);
          }}
          aria-label="Favorite"
        >
          <i className={`${liked ? "fa-solid" : "fa-regular"} fa-heart`} />
        </button>
      </div>

      {/* 가격 + 상품명 */}
      <div className="pt-2">
        <div className="text-[12px] text-black/70 font-medium">
          {product.price.toFixed(2)}$
        </div>
        <div className="mt-1 text-[12px] text-black/70 leading-snug line-clamp-2">
          {product.name}
        </div>
      </div>
    </div>
  );
}
