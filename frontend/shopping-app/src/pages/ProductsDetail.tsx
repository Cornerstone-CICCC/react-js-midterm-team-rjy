import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

type Product = {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  sale?: { original: number; current: number };
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  
  const [isDescOpen, setIsDescOpen] = useState(true);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);

  useEffect(() => {
    // 1. Fetch Product Detail
    fetch(`http://localhost:3000/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then(data => setProduct(data))
      .catch(() => {
        // Fallback dummy data for development
        setProduct({
          _id: id || "1",
          name: "Claudette corset shirt dress in white",
          price: 65.00,
          imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000",
          description: "A shirt is a profitable investment in the wardrobe. And here's why:\n- shirts perfectly match with any bottom\n- shirts made of natural fabrics are suitable for any time of the year.",
          sale: { original: 79.95, current: 65.00 }
        });
      });

    // 2. Fetch Lists for Sliders
    fetch(`http://localhost:3000/api/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mid = Math.ceil(data.length / 2);
          setSimilarProducts(data.slice(0, mid));
          setRecommendedProducts(data.slice(mid));
        }
      })
      .catch(() => {
        setSimilarProducts([]);
        setRecommendedProducts([]);
      });
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setLoadingCart(true);

    try {
      const response = await fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          quantity: qty,
        }),
      });

      if (response.ok) {
        toast.success("Successfully added to cart!", {
          position: "top-center",
          style: { 
            background: "#333", 
            color: "#fff", 
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "bold"
          }
        });
        // Wait a bit for the toast to be seen before navigating
        setTimeout(() => navigate("/cart"), 1200);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add to cart.");
      }
    } catch (error) {
      toast.error("Server connection error. Please try again later.");
    } finally {
      setLoadingCart(false);
    }
  };

  if (!product) return null;

  return (
    <div className="bg-white min-h-screen pb-32 font-sans relative">
      {/* Toast Container */}
      <Toaster /> 

      {/* Hero Image Section */}
      <div className="relative w-full aspect-[3/4] bg-[#F3F3F3]">
        <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
        <div className="absolute top-12 left-6 right-6 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="p-2 w-10 h-10 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm">
            <i className="fa-solid fa-chevron-left text-xl text-black" />
          </button>
          <button className="p-2 w-10 h-10 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm">
            <i className="fa-solid fa-share-nodes text-xl text-black" />
          </button>
        </div>
      </div>

      <div className="px-6 pt-8">
        {/* Title and Like Button */}
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-[20px] font-medium text-slate-900 leading-snug w-[85%]">{product.name}</h1>
          <button onClick={() => setIsLiked(!isLiked)} className="pt-1">
            <i className={`${isLiked ? "fa-solid text-red-500" : "fa-regular text-slate-400"} fa-heart text-[22px]`} />
          </button>
        </div>

        {/* Rating and Price */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(s => <i key={s} className="fa-solid fa-star text-[12px] text-slate-900" />)}
            <span className="ml-1 text-[13px] font-bold text-slate-900">5.0</span>
          </div>
          <div className="flex items-center gap-2">
            {product.sale && (
              <span className="text-[14px] text-slate-300 line-through">
                ${product.sale.original.toFixed(2)}
              </span>
            )}
            <span className="text-[18px] font-bold text-red-500">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center border border-slate-100 rounded-xl w-fit mb-10 px-2 py-1 gap-4">
          <button 
            onClick={() => setQty(Math.max(1, qty - 1))} 
            className="p-2 text-slate-300 text-lg active:text-black transition-colors"
          >
            -
          </button>
          <span className="font-bold text-[15px] w-4 text-center">{qty}</span>
          <button 
            onClick={() => setQty(qty + 1)} 
            className="p-2 text-slate-800 text-lg active:text-black transition-colors"
          >
            +
          </button>
        </div>

        {/* Accordions */}
        <div className="space-y-6 mb-12">
          {/* Description */}
          <div className="border-t border-slate-50 pt-5">
            <button 
              onClick={() => setIsDescOpen(!isDescOpen)} 
              className="w-full flex justify-between items-center text-[16px] font-bold text-slate-900"
            >
              Description 
              <i className={`fa-solid ${isDescOpen ? "fa-angle-up" : "fa-angle-down"} text-sm`} />
            </button>
            {isDescOpen && (
              <div className="mt-4 text-[13px] text-slate-500 leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="border-t border-slate-50 pt-5 border-b pb-5">
            <button 
              onClick={() => setIsReviewsOpen(!isReviewsOpen)} 
              className="w-full flex justify-between items-center text-[16px] font-bold text-slate-900"
            >
              Customer reviews 
              <i className={`fa-solid ${isReviewsOpen ? "fa-angle-up" : "fa-angle-down"} text-sm`} />
            </button>
            {isReviewsOpen && (
              <div className="mt-4 text-[13px] text-slate-400">
                No reviews yet.
              </div>
            )}
          </div>
        </div>

        {/* Similar Products Slider */}
        <h3 className="text-[17px] font-bold text-slate-900 mb-5">Similar products</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 mb-10">
          {similarProducts.length > 0 ? (
            similarProducts.map((p) => (
              <div key={p._id} className="min-w-[150px] cursor-pointer" onClick={() => navigate(`/product/${p._id}`)}>
                <div className="aspect-[3/4] rounded-[20px] overflow-hidden bg-slate-50 mb-3">
                  <img src={p.imageUrl} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="text-[14px] font-bold">${p.price.toFixed(2)}</div>
                <div className="text-[12px] text-slate-500 line-clamp-1">{p.name}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No similar products found.</p>
          )}
        </div>

        {/* Recommendation Slider */}
        <h3 className="text-[17px] font-bold text-slate-900 mb-5">We think you'll love</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {recommendedProducts.length > 0 ? (
            recommendedProducts.map((p) => (
              <div key={p._id} className="min-w-[150px] cursor-pointer" onClick={() => navigate(`/product/${p._id}`)}>
                <div className="aspect-[3/4] rounded-[20px] overflow-hidden bg-slate-50 mb-3">
                  <img src={p.imageUrl} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="text-[14px] font-bold">${p.price.toFixed(2)}</div>
                <div className="text-[12px] text-slate-500 line-clamp-1">{p.name}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No recommendations found.</p>
          )}
        </div>
      </div>

      {/* Floating Add to Cart Button */}
      <div className="fixed bottom-8 left-6 right-6 z-30">
        <button 
          onClick={handleAddToCart}
          disabled={loadingCart}
          className={`w-full py-5 rounded-[22px] font-bold shadow-lg transition-all active:scale-95 
            ${loadingCart ? "bg-gray-400 cursor-not-allowed text-white" : "bg-black text-white hover:bg-zinc-800"}`}
        >
          {loadingCart ? "Adding to cart..." : "Add to cart"}
        </button>
      </div>
    </div>
  );
}