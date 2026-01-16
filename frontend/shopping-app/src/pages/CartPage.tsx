import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchModal from "../components/SearchModal";
import type { SearchProduct } from "../components/SearchModal";

type CartItem = {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    description?: string;
    sale?: { original: number; current: number };
  } | null;
  quantity: number;
};

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [allProducts, setAllProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [cartRes, productsRes] = await Promise.all([
        fetch("http://localhost:3000/api/cart"),
        fetch("http://localhost:3000/api/products")
      ]);
      const cartData = await cartRes.json();
      const productsData = await productsRes.json();
      setCartItems(Array.isArray(cartData) ? cartData : []);
      setAllProducts(Array.isArray(productsData) ? productsData : []);
    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updateQty = async (id: string, newQty: number) => {
    if (newQty < 1) return;
    const previousItems = [...cartItems];
    setCartItems(prev => prev.map(item => item._id === id ? { ...item, quantity: newQty } : item));
    try {
      const res = await fetch(`http://localhost:3000/api/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
      if (!res.ok) throw new Error();
    } catch (e) {
      setCartItems(previousItems);
      alert("Failed to update quantity.");
    }
  };

  const removeItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    const previousItems = [...cartItems];
    setCartItems(prev => prev.filter(item => item._id !== id));
    try {
      const res = await fetch(`http://localhost:3000/api/cart/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch (e) {
      setCartItems(previousItems);
      alert("Failed to remove item.");
    }
  };

  const subTotal = cartItems.reduce((acc, item) => acc + (item.productId?.price || 0) * item.quantity, 0);
  const originalTotal = cartItems.reduce((acc, item) => {
    const originalPrice = item.productId?.sale?.original || item.productId?.price || 0;
    return acc + originalPrice * item.quantity;
  }, 0);
  const discount = originalTotal - subTotal;

  if (loading) return <div className="p-10 text-center font-bold">Loading...</div>;

  return (
    <div className="bg-white lg:bg-[#F9F9F9] min-h-screen" style={{ fontFamily: "'Lora', serif" }}>
      <div className="max-w-[1200px] mx-auto bg-white min-h-screen lg:min-h-[auto] lg:mt-10 lg:mb-20 lg:rounded-3xl lg:shadow-xl overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-white px-6 pt-6 pb-4 flex justify-between items-center sticky top-0 z-30">
          {/* ✅ 뒤로가기 대신 /shop 페이지로 이동하도록 수정 완료 */}
          <button onClick={() => navigate("/shop")} className="p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h1 className="text-[17px] font-medium font-sans">Cart</h1>
          <button className="p-1" onClick={() => setIsSearchOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </div>

        <div className="lg:flex lg:gap-0">
          <div className="lg:flex-[1.5] lg:p-10 lg:border-r lg:border-gray-100">
            <p className="text-center lg:text-left text-[#8E8E93] mt-2 lg:mt-0 mb-6 text-[14px]">
              You have <span className="text-black font-semibold">{cartItems.length} products</span> in your Cart
            </p>

            <div className="space-y-[1px] bg-[#F2F2F2] lg:bg-transparent lg:space-y-6">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item._id} className="bg-white px-6 py-5 flex gap-4 relative lg:px-0">
                    <button onClick={() => removeItem(item._id)} className="absolute top-5 right-6 lg:right-0 text-black">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <div className="w-[90px] h-[115px] lg:w-[110px] lg:h-[140px] rounded-[8px] overflow-hidden bg-[#F8F8F8] flex-shrink-0">
                      <img src={item.productId?.imageUrl} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex flex-col justify-between flex-1">
                      <div className="pr-8">
                        <h3 className="text-[15px] lg:text-[17px] font-normal leading-snug text-black mb-1">{item.productId?.name}</h3>
                        <div className="flex flex-col">
                          {item.productId?.sale && <span className="text-[12px] text-[#A1A1A1] line-through">{item.productId.sale.original.toFixed(2)}$</span>}
                          <span className="text-[16px] lg:text-[18px] font-bold text-[#D3180C]">{item.productId?.price.toFixed(2)}$</span>
                        </div>
                      </div>
                      <div className="flex items-center bg-white rounded-full px-2 py-0.5 gap-4 w-fit border border-[#EEEEEE] self-end lg:self-start shadow-sm lg:mt-2">
                        <button onClick={() => updateQty(item._id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-[#8E8E93] text-xl font-light">-</button>
                        <span className="font-normal text-[14px]">{item.quantity}</span>
                        <button onClick={() => updateQty(item._id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-black text-xl font-light">+</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white py-20 text-center text-gray-400">Your cart is empty.</div>
              )}
            </div>

            <div className="lg:hidden px-8 py-8 space-y-4">
              <div className="flex justify-between text-[#8E8E93] text-[15px]"><span>Total Price</span><span className="text-black font-light">{originalTotal.toFixed(2)}$</span></div>
              <div className="flex justify-between text-[#8E8E93] text-[15px]"><span>Discount</span><span className="text-black font-light">{discount.toFixed(2)}$</span></div>
              <div className="flex justify-between text-[#8E8E93] text-[15px]"><span>Estimated delivery fees</span><span className="text-black font-light">Free</span></div>
            </div>
            <div className="h-[150px] lg:hidden"></div>
          </div>

          <div className="hidden lg:block lg:flex-1 bg-[#FDFDFD] p-10">
            <div className="sticky top-28">
              <h2 className="text-[24px] font-bold mb-8">Summary</h2>
              <div className="space-y-5 pb-8 border-b border-gray-100">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{originalTotal.toFixed(2)}$</span></div>
                <div className="flex justify-between text-gray-500"><span>Discount</span><span className="text-red-500">-{discount.toFixed(2)}$</span></div>
                <div className="flex justify-between text-gray-500"><span>Delivery</span><span>Free</span></div>
              </div>
              <div className="py-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[18px] font-medium">Total Price</span>
                  <span className="text-[28px] font-bold">{subTotal.toFixed(2)}$</span>
                </div>
                <p className="text-right text-gray-400 text-sm">Saving Applied: {discount.toFixed(2)}$</p>
              </div>
              <button 
                onClick={() => navigate("/checkout")}
                className="w-full bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                Checkout Now
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Bar */}
        <div className="lg:hidden fixed bottom-[65px] left-0 right-0 bg-[#F2F2F2] px-6 pt-6 pb-6 rounded-t-[30px] shadow-[0_-15px_30px_rgba(0,0,0,0.05)] z-40">
          <div className="flex justify-between items-center mb-5 px-1">
            <div>
              <span className="text-[18px] font-bold">Total:</span>
              <span className="text-[#8E8E93] text-[13px] block mt-0.5 font-sans">Saving Applied: {discount.toFixed(2)}$</span>
            </div>
            <span className="text-[22px] font-bold text-black">{subTotal.toFixed(2)}$</span>
          </div>
          <button 
            onClick={() => navigate("/checkout")}
            className="w-full bg-[#090A0A] text-white py-[16px] rounded-[12px] font-medium flex items-center justify-center gap-3"
          >
            Checkout
          </button>
        </div>

        <SearchModal 
          open={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
          products={allProducts} 
          onSelect={(id) => navigate(`/product/${id}`)} 
        />
      </div>
    </div>
  );
}