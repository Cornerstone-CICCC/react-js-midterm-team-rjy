import { useEffect, useMemo, useState } from "react";

type Product = {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  sale?: { original: number; current: number };
};

type CartItem = {
  _id: string;
  productId: Product; // populate 된 형태
  quantity: number;
};

type Props = {
  onBack?: () => void | Promise<void>;
  onCartChanged?: () => void | Promise<void>; // optional
  onOpenSearch?: () => void; // ✅ 검색 모달 열기(상단 돋보기)
};

export default function Cart({ onBack, onCartChanged, onOpenSearch }: Props) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState("");

  const totalQty = useMemo(
    () => items.reduce((sum, it) => sum + (it.quantity ?? 0), 0),
    [items]
  );

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => {
      const p = it.productId;
      const unit = p.sale ? p.sale.current : p.price;
      return sum + unit * it.quantity;
    }, 0);
  }, [items]);

  const load = async () => {
    try {
      setStatus("loading");
      setError("");

      const res = await fetch("http://localhost:3000/api/cart", {
        credentials: "include",
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${t}`);
      }
      const data = (await res.json()) as CartItem[];
      setItems(Array.isArray(data) ? data : []);
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const removeItem = async (id: string) => {
    const res = await fetch(`http://localhost:3000/api/cart/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to delete");
    await load();
    await onCartChanged?.();
  };

  const setQty = async (id: string, qty: number) => {
    const res = await fetch(`http://localhost:3000/api/cart/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ quantity: qty }),
    });
    if (!res.ok) throw new Error("Failed to update qty");
    await load();
    await onCartChanged?.();
  };

  if (status === "loading") return <p>Loading cart...</p>;

  if (status === "error") {
    return (
      <div className="cart-figma cart-figma-pad">
        <div className="cart-figma-error">
          <div className="err-title">Cart load failed</div>
          <div className="err-msg">{error}</div>
          <button className="retry" onClick={load}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-figma">
      {/* Top bar */}
      <div className="cart-figma-top">
        <button
          className="cart-figma-icon"
          onClick={() => onBack?.()}
          aria-label="back"
          type="button"
        >
          <i className="fa-solid fa-chevron-left" />
        </button>

        <div className="cart-figma-title">Cart</div>

        <button
          className="cart-figma-icon"
          aria-label="search"
          type="button"
          onClick={onOpenSearch}
        >
          <i className="fa-solid fa-magnifying-glass" />
        </button>
      </div>

      <div className="cart-figma-sub">
        You have <b>{totalQty}</b> products in your Cart
      </div>

      {/* List */}
      <div className="cart-figma-list">
        {items.map((it) => {
          const p = it.productId;
          const hasSale = !!p.sale;
          const unit = hasSale ? p.sale!.current : p.price;

          return (
            <div key={it._id} className="cart-figma-item">
              <div className="cart-figma-thumb">
                <img src={p.imageUrl} alt={p.name} />
              </div>

              <div className="cart-figma-mid">
                {/* name + x same line */}
                <div className="flex items-start justify-between gap-2">
                  <div className="cart-figma-name">{p.name}</div>
                  <button
                    className="cart-figma-x"
                    onClick={() => removeItem(it._id)}
                    aria-label="remove"
                    type="button"
                  >
                    <i className="fa-solid fa-x" />
                  </button>
                </div>

                {/* price */}
                <div className="cart-figma-price">
                  {hasSale ? (
                    <span className="flex items-center gap-2">
                      <span className="line-through text-black/30 text-[11px]">
                        {p.sale!.original.toFixed(2)}$
                      </span>
                      <span className="text-[12px] font-semibold text-black/80">
                        {p.sale!.current.toFixed(2)}$
                      </span>
                    </span>
                  ) : (
                    <span className="text-[12px] font-semibold text-black/80">
                      {unit.toFixed(2)}$
                    </span>
                  )}
                </div>
              </div>

              <div className="cart-figma-right">
                <div className="cart-figma-qty">
                  <button
                    className="qty-btn"
                    disabled={it.quantity <= 1}
                    onClick={() => setQty(it._id, it.quantity - 1)}
                    type="button"
                  >
                    −
                  </button>
                  <div className="qty-num">{it.quantity}</div>
                  <button
                    className="qty-btn"
                    onClick={() => setQty(it._id, it.quantity + 1)}
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="cart-figma-summary">
        <div className="sum-row">
          <span>Total Price</span>
          <span className="sum-val">{subtotal.toFixed(2)}$</span>
        </div>
        <div className="sum-row">
          <span>Discount</span>
          <span className="sum-val">0.00$</span>
        </div>
        <div className="sum-row">
          <span>Estimated delivery fees</span>
          <span className="sum-val">Free</span>
        </div>

        <div className="cart-figma-divider" />

        <div className="total-row">
          <div>
            <div className="total-label">Total:</div>
            <div className="saving">Saving Applied</div>
          </div>
          <div className="total-val">{subtotal.toFixed(2)}$</div>
        </div>

        <button className="cart-figma-checkout" type="button">
          <i className="fa-solid fa-cart-shopping mr-2" />
          Checkout
        </button>
      </div>
    </div>
  );
}
