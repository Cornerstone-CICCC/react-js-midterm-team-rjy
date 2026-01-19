import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useCart } from "../context/CartContext"; 

type Product = {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  sale?: { original: number; current: number };
};

export default function ProductsDetail() {
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
  const { addToCart } = useCart();

  const LS_KEY = "favorites_product_ids";
useEffect(() => {
  if (!id) return; 

  // 1. 상품 상세 정보 페치
  fetch(`http://localhost:3000/api/products/${id}`)
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => {
      setProduct(data);
      
      // 로컬 스토리지 확인하여 좋아요 상태 초기화
      const raw = localStorage.getItem(LS_KEY);
      const favIds = new Set(raw ? JSON.parse(raw) : []);
      if (favIds.has(data._id)) {
        setIsLiked(true);
      }
    })
    .catch(() => {
      // 에러 시 테스트 데이터 (생략 없이 작성)
      const fallback = {
        _id: id,
        name: "Claudette corset shirt dress in white",
        price: 65.00,
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000",
        description: "A shirt is a profitable investment in the wardrobe. And here's why:\n- shirts perfectly match with any bottom\n- shirts made of natural fabrics are suitable for any time of the year.",
        sale: { original: 79.95, current: 65.00 }
      };
      setProduct(fallback);
      const raw = localStorage.getItem(LS_KEY);
      const favIds = new Set(raw ? JSON.parse(raw) : []);
      if (favIds.has(fallback._id)) setIsLiked(true);
    });

  // 2. 추천/유사 상품 페치 
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
      console.error("Error fetching similar/recommended products");
    });
}, [id]);

  // 좋아요 클릭 핸들러
  const handleLikeClick = () => {
    if (!product) return;
    const nextLikedState = !isLiked;
    setIsLiked(nextLikedState);
    const raw = localStorage.getItem(LS_KEY);
    const favIds = new Set(raw ? JSON.parse(raw) : []);
    if (nextLikedState) {
      favIds.add(product._id);
      toast.success("Added to your wishlist!", {
        position: "top-center",
        style: { background: "#333", color: "#fff", borderRadius: "10px", fontSize: "14px", fontWeight: "bold" },
        icon: '❤️'
      });
    } else {
      favIds.delete(product._id);
      toast("Removed from wishlist", {
        position: "top-center",
        style: { background: "#eee", color: "#333", borderRadius: "10px", fontSize: "14px" }
      });
    }
    localStorage.setItem(LS_KEY, JSON.stringify(Array.from(favIds)));
  };

  // 장바구니 추가 핸들러
  const handleAddToCart = async () => {
    if (!product) return;
    setLoadingCart(true);
    try {
      await addToCart(product._id, qty);
      toast.success("Successfully added to cart!", { position: "top-center" });
    } catch (error) {
      toast.error("Error adding to cart");
    } finally {
      setLoadingCart(false);
    }
  };

  // [수정 포인트] 하단 카드 렌더링 함수 - 사이즈 불일치 해결
  const renderProductCard = (p: Product) => (
    <div 
      key={p._id} 
      className="inline-block w-[160px] lg:w-[260px] mr-6 cursor-pointer align-top group" 
      onClick={() => {
        navigate(`/product/${p._id}`);
        window.scrollTo(0, 0);
      }}
    >
      {/* 3:4 비율 고정 및 이미지 꽉 채우기 */}
      <div className="relative w-full aspect-[3/4] rounded-[22px] lg:rounded-[30px] overflow-hidden bg-gray-100 mb-3 shadow-sm transition-transform duration-500 group-hover:shadow-md">
        <img src={p.imageUrl} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={p.name} />
      </div>
      <div className="px-1">
        <div className="text-[16px] lg:text-[20px] font-black text-slate-900 mb-1">${p.price.toFixed(2)}</div>
        <div className="text-[12px] lg:text-[15px] text-slate-500 font-medium whitespace-normal line-clamp-2 leading-tight h-[2.6em]">{p.name}</div>
      </div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="bg-white min-h-screen pb-32 font-['Lora'] serif relative">
      {/* 중앙 정렬 컨테이너 */}
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* 상단 네비게이션 */}
        <div className="flex justify-between items-center py-8 lg:py-12">
          <button onClick={() => navigate(-1)} className="p-2 flex items-center justify-center hover:opacity-50 transition-opacity">
            <i className="fa-solid fa-chevron-left text-2xl text-black" />
          </button>
          <button className="p-2 flex items-center justify-center hover:opacity-50 transition-opacity">
            <i className="fa-solid fa-share-nodes text-2xl text-black" />
          </button>
        </div>

        {/* 데스크탑 2열 레이아웃 */}
        <div className="lg:flex lg:gap-20 items-start">
          
          {/* 왼쪽: 상품 이미지 */}
          <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
            <div className="relative w-full aspect-[3/4] rounded-[30px] lg:rounded-[45px] overflow-hidden shadow-lg bg-gray-50">
              <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
            </div>
          </div>

          {/* 오른쪽: 상품 정보 */}
          <div className="w-full lg:w-1/2">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-[26px] lg:text-[38px] font-black text-slate-900 leading-tight w-[85%] uppercase tracking-tighter">
                {product.name}
              </h1>
              <button onClick={handleLikeClick} className="pt-2 hover:scale-110 transition-transform">
                <i className={`${isLiked ? "fa-solid text-red-500" : "fa-regular text-slate-300"} fa-heart text-[28px] lg:text-[34px]`} />
              </button>
            </div>

            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <i key={s} className="fa-solid fa-star text-[14px] text-black" />
                ))}
                <span className="ml-2 text-[15px] lg:text-[18px] font-bold underline">5.0</span>
              </div>
              <div className="flex items-center gap-3">
                {product.sale && (
                  <span className="text-[16px] lg:text-[20px] text-slate-300 line-through">${product.sale.original.toFixed(2)}</span>
                )}
                <span className="text-[24px] lg:text-[36px] font-black text-red-500">${product.price.toFixed(2)}</span>
              </div>
            </div>

            {/* 수량 조절 */}
            <div className="flex items-center border-2 border-slate-100 rounded-2xl w-fit mb-12 px-3 py-1 gap-6">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 text-slate-300 text-2xl hover:text-black">-</button>
              <span className="font-black text-[18px] lg:text-[22px] w-6 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-2 text-slate-800 text-2xl hover:text-black">+</button>
            </div>

            {/* 데스크탑 장바구니 버튼 (상시 노출) */}
            <div className="hidden lg:block mb-12">
              <button 
                onClick={handleAddToCart}
                disabled={loadingCart}
                className={`w-full py-6 rounded-[25px] font-black text-[18px] text-white shadow-xl active:scale-95 transition-all
                  ${loadingCart ? "bg-gray-400" : "bg-black hover:bg-zinc-800"}`}
              >
                {loadingCart ? "ADDING TO CART..." : "ADD TO CART"}
              </button>
            </div>

            {/* 아코디언 메뉴 */}
            <div className="space-y-6">
              <div className="border-t-2 border-slate-50 pt-6">
                <button onClick={() => setIsDescOpen(!isDescOpen)} className="w-full flex justify-between items-center text-[18px] lg:text-[20px] font-black text-slate-900 uppercase">
                  Description 
                  <i className={`fa-solid ${isDescOpen ? "fa-angle-up" : "fa-angle-down"} text-sm`} />
                </button>
                {isDescOpen && (
                  <div className="mt-5 text-[14px] lg:text-[16px] text-slate-500 leading-relaxed whitespace-pre-line font-medium">
                    {product.description}
                  </div>
                )}
              </div>

              <div className="border-t-2 border-slate-50 pt-6 border-b-2 pb-6">
                <button onClick={() => setIsReviewsOpen(!isReviewsOpen)} className="w-full flex justify-between items-center text-[18px] lg:text-[20px] font-black text-slate-900 uppercase">
                  Customer reviews 
                  <i className={`fa-solid ${isReviewsOpen ? "fa-angle-up" : "fa-angle-down"} text-sm`} />
                </button>
                {isReviewsOpen && (
                  <div className="mt-5 text-[14px] text-slate-400 italic">No reviews yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 하단 섹션 (동일한 카드 사이즈 적용) */}
        <div className="mt-24 lg:mt-40">
          <h3 className="text-[22px] lg:text-[32px] font-black mb-8 uppercase tracking-tighter">Similar products</h3>
          <div className="flex overflow-x-auto no-scrollbar whitespace-nowrap pb-10">
            {similarProducts.map(p => renderProductCard(p))}
          </div>

          <h3 className="text-[22px] lg:text-[32px] font-black mt-16 lg:mt-24 mb-8 uppercase tracking-tighter">We think you'll love</h3>
          <div className="flex overflow-x-auto no-scrollbar whitespace-nowrap pb-10">
            {recommendedProducts.map(p => renderProductCard(p))}
          </div>
        </div>
      </div>

      {/* 모바일 하단 고정 버튼 */}
      <div className="lg:hidden fixed bottom-28 left-6 right-6 z-40">
        <button 
          onClick={handleAddToCart}
          disabled={loadingCart}
          className={`w-full py-5 rounded-[22px] font-bold text-white shadow-2xl active:scale-95 transition-all
            ${loadingCart ? "bg-gray-400" : "bg-black"}`}
        >
          {loadingCart ? "Adding to cart..." : "Add to cart"}
        </button>
      </div>
    </div>
  );
}