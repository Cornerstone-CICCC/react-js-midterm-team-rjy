import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchModal from "../components/SearchModal";
import type { SearchProduct } from "../components/SearchModal";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<SearchProduct[]>([]);

  const {
    cartItems,
    updateQty,
    removeFromCart,
    subTotal,
  } = useCart();

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/products");
      const data = await res.json();
      setAllProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error fetching products:", e);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const originalTotal = cartItems.reduce((acc, item) => {
    const originalPrice = item.productId?.sale?.original || item.productId?.price || 0;
    return acc + originalPrice * item.quantity;
  }, 0);

  const discount = originalTotal - subTotal;

  if (!cartItems) return null;

  return (
    <div className="bg-white lg:bg-[#F9F9F9] min-h-screen font-['Lora'] serif">
      <div className="max-w-[1200px] mx-auto bg-white min-h-screen lg:min-h-[auto] lg:mt-10 lg:mb-20 lg:rounded-[40px] lg:shadow-xl overflow-hidden relative">
        
        {/* HEADER */}
        <header className="py-8 lg:py-14 px-6 lg:px-10 flex items-center justify-between bg-white sticky top-0 z-30">
          <button onClick={() => navigate("/shop")} className="text-xl lg:text-3xl hover:opacity-50 transition-opacity">
            <i className="fa-solid fa-chevron-left text-black" />
          </button>

          <h1 className="text-[20px] lg:text-[32px] font-black uppercase tracking-tight text-black">
            Cart
          </h1>

          <button onClick={() => setIsSearchOpen(true)} className="hover:opacity-50 transition-opacity">
            <i className="fa-solid fa-magnifying-glass text-[22px] lg:text-[28px] text-black" />
          </button>
        </header>

        <div className="lg:flex lg:gap-0">
          {/* LEFT SIDE — ITEMS */}
          <div className="lg:flex-[1.5] lg:p-10 lg:border-r lg:border-gray-100">
            <p className="text-center lg:text-left text-[#8E8E93] mt-2 lg:mt-0 mb-6 text-[14px]">
              You have <span className="text-black font-semibold">{cartItems.length} products</span> in your Cart
            </p>

            <div className="space-y-[1px] bg-[#F2F2F2] lg:bg-transparent lg:space-y-6">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item._id} className="bg-white px-6 py-5 flex gap-4 relative lg:px-0">
                    <button 
                      onClick={() => removeFromCart(item._id)} 
                      className="absolute top-5 right-6 lg:right-0 text-black hover:text-red-500 transition-colors"
                    >
                      <i className="fa-solid fa-xmark text-lg" />
                    </button>

                    <div className="w-[90px] h-[115px] lg:w-[110px] lg:h-[140px] rounded-[15px] overflow-hidden bg-[#F8F8F8] flex-shrink-0 shadow-sm">
                      <img src={item.productId?.imageUrl} className="w-full h-full object-cover" alt="" />
                    </div>

                    <div className="flex flex-col justify-between flex-1">
                      <div className="pr-8">
                        <h3 className="text-[15px] lg:text-[17px] font-bold leading-snug text-black mb-1">
                          {item.productId?.name}
                        </h3>

                        <div className="flex flex-col">
                          {item.productId?.sale && (
                            <span className="text-[12px] text-[#A1A1A1] line-through">
                              ${item.productId.sale.original.toFixed(2)}
                            </span>
                          )}
                          <span className="text-[16px] lg:text-[18px] font-black text-[#D3180C]">
                            ${item.productId?.price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center bg-white rounded-full px-2 py-0.5 gap-4 w-fit border border-[#EEEEEE] self-end lg:self-start shadow-sm lg:mt-2">
                        <button 
                          onClick={() => updateQty(item._id, item.quantity - 1)} 
                          className="w-8 h-8 flex items-center justify-center text-[#8E8E93] text-xl font-light hover:text-black"
                        >
                          -
                        </button>

                        <span className="font-bold text-[14px]">{item.quantity}</span>

                        <button 
                          onClick={() => updateQty(item._id, item.quantity + 1)} 
                          className="w-8 h-8 flex items-center justify-center text-black text-xl font-light hover:scale-110"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white py-20 text-center text-gray-400 flex flex-col items-center">
                  <i className="fa-solid fa-cart-shopping text-4xl mb-4 opacity-20" />
                  <p>Your cart is empty.</p>
                </div>
              )}
            </div>

            {/* MOBILE SUMMARY */}
            <div className="lg:hidden px-8 py-8 space-y-4">
              <div className="flex justify-between text-[#8E8E93] text-[15px]">
                <span>Total Price</span>
                <span className="text-black font-medium">${originalTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-[#8E8E93] text-[15px]">
                <span>Discount</span>
                <span className="text-red-500">-${discount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-[#8E8E93] text-[15px]">
                <span>Estimated delivery fees</span>
                <span className="text-black font-medium">Free</span>
              </div>
            </div>

            <div className="h-[150px] lg:hidden"></div>
          </div>

          {/* RIGHT SIDE — DESKTOP SUMMARY */}
          <div className="hidden lg:block lg:flex-1 bg-[#FDFDFD] p-10">
            <div className="sticky top-28">
              <h2 className="text-[24px] font-black mb-8 uppercase tracking-tighter">Summary</h2>

              <div className="space-y-5 pb-8 border-b border-gray-100 font-medium">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>${originalTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-500">
                  <span>Discount</span>
                  <span className="text-red-500">-${discount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-500">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
              </div>

              <div className="py-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[18px] font-bold">Total Price</span>
                  <span className="text-[32px] font-black">${subTotal.toFixed(2)}</span>
                </div>

                <p className="text-right text-gray-400 text-sm">
                  Saving Applied: ${discount.toFixed(2)}
                </p>
              </div>

              <button 
                onClick={() => navigate("/checkout")}
                className="w-full bg-black text-white py-6 rounded-[20px] font-black text-[18px] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl active:scale-95"
              >
                <i className="fa-solid fa-credit-card" />
                CHECKOUT NOW
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE BOTTOM BAR */}
        <div className="lg:hidden fixed bottom-[65px] left-0 right-0 bg-[#F2F2F2] px-6 pt-6 pb-6 rounded-t-[35px] shadow-[0_-15px_30px_rgba(0,0,0,0.08)] z-40">
          <div className="flex justify-between items-center mb-5 px-1">
            <div>
              <span className="text-[18px] font-black">Total:</span>
              <span className="text-[#8E8E93] text-[12px] block mt-0.5">
                Saving Applied: ${discount.toFixed(2)}
              </span>
            </div>

            <span className="text-[24px] font-black text-black">
              ${subTotal.toFixed(2)}
            </span>
          </div>

          <button 
            onClick={() => navigate("/checkout")}
            className="w-full bg-black text-white py-[18px] rounded-[15px] font-black text-[16px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
          >
            Checkout
          </button>
        </div>

        {/* SEARCH MODAL */}
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
