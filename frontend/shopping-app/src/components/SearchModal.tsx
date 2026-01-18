import { useEffect, useMemo, useState } from "react";

export type SearchProduct = {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  products: SearchProduct[];
  onSelect: (id: string) => void;
};

function normalize(s: string) {
  return (s ?? "").toLowerCase().trim();
}

export default function SearchModal({ open, onClose, products, onSelect }: Props) {
  const [q, setQ] = useState("");

  // open 될 때마다 입력 초기화 + 포커스
  useEffect(() => {
    if (!open) return;
    setQ("");
    const t = window.setTimeout(() => {
      const el = document.getElementById("search-input") as HTMLInputElement | null;
      el?.focus();
    }, 30);
    return () => window.clearTimeout(t);
  }, [open]);

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const results = useMemo(() => {
    const query = normalize(q);
    if (!query) return [];
    return products
      .filter((p) => {
        const name = normalize(p.name);
        const desc = normalize(p.description ?? "");
        return name.includes(query) || desc.includes(query);
      })
      .slice(0, 20);
  }, [q, products]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      {/* overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close search"
        onClick={onClose}
      />

      {/* sheet */}
      <div className="absolute left-1/2 top-16 w-[min(520px,92vw)] -translate-x-1/2 rounded-2xl bg-white shadow-xl border border-black/10 overflow-hidden">
        {/* header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-black/10">
          <div className="text-[13px] font-semibold text-black/80">Search</div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 grid place-items-center rounded-xl hover:bg-black/5"
            aria-label="Close"
          >
            <i className="fa-solid fa-x"></i>
          </button>
        </div>

        {/* input */}
        <div className="px-4 py-3">
          <div className="h-11 rounded-xl border border-black/10 bg-white flex items-center gap-3 px-3">
            <i className="fa-solid fa-magnifying-glass text-black/50"></i>
            <input
              id="search-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products..."
              className="w-full h-full outline-none text-[13px] text-black/80 placeholder:text-black/35"
            />
          </div>
          <div className="mt-2 text-[11px] text-black/45">
            {q ? `${results.length} result(s)` : "Type to search by name or description"}
          </div>
        </div>

        {/* list */}
        <div className="max-h-[55vh] overflow-y-auto">
          {q && results.length === 0 && (
            <div className="px-4 pb-4 text-[12px] text-black/50">No results.</div>
          )}

          {results.map((p) => (
            <button
              key={p._id}
              type="button"
              onClick={() => {
                onSelect(p._id);
                onClose();
              }}
              className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-black/5"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/5 border border-black/10 flex-shrink-0">
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-semibold text-black/80 truncate">{p.name}</div>
                <div className="text-[11px] text-black/45 truncate">
                  {(p.description ?? "").slice(0, 80)}
                </div>
              </div>

              <div className="text-[12px] font-semibold text-black/70">
                {p.price.toFixed(2)}$
              </div>
            </button>
          ))}
        </div>

        {/* footer */}
        <div className="px-4 py-3 border-t border-black/10">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-black text-white text-[13px] font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
