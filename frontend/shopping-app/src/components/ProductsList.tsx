import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchModal from "./SearchModal";
import type { SearchProduct } from "./SearchModal";

interface Product extends SearchProduct {
  category: string;
}

const BANNER_IMAGES = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000"
];

export default function ProductsList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => console.log("DB 연결 전입니다."));
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length);

  const categories = ["All", "Tops", "Bottoms", "Outerwear", "Dresses"];
  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-white min-h-screen pb-20 font-sans overflow-x-hidden">
      {/* 1. Header: BOUTIQUE 중앙 배치 */}
      <header className="relative flex items-center justify-center px-6 py-6 bg-white">
        <h1 className="text-[24px] font-black tracking-tighter text-black uppercase">BOUTIQUE</h1>
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="absolute right-6 p-2"
        >
          <i className="fa-solid fa-magnifying-glass text-[22px] text-black" />
        </button>
      </header>

      {/* 2. 메인 슬라이더: 사진 클릭 시 상세페이지 이동 */}
      <div className="relative w-full h-[480px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 transition-all duration-700"
          style={{ backgroundImage: `url(${BANNER_IMAGES[currentSlide]})` }}
        />
        
        <div className="relative h-full flex items-center justify-center px-10">
          <div 
            onClick={() => {
              // 상품이 있으면 해당 ID로, 없으면 테스트용 ID '1'로 이동
              const targetId = products.length > 0 ? products[currentSlide % products.length]._id : "1";
              navigate(`/product/${targetId}`);
            }}
            className="w-full max-w-[280px] aspect-[3/4.5] rounded-[50px] overflow-hidden shadow-2xl z-10 cursor-pointer active:scale-95 transition-transform"
          >
            <img src={BANNER_IMAGES[currentSlide]} className="w-full h-full object-cover" alt="Main" />
          </div>

          <button onClick={prevSlide} className="absolute left-4 z-20 text-black/10 hover:text-black">
            <i className="fa-solid fa-chevron-left text-3xl" />
          </button>
          <button onClick={nextSlide} className="absolute right-4 z-20 text-black/10 hover:text-black">
            <i className="fa-solid fa-chevron-right text-3xl" />
          </button>
        </div>
      </div>

      {/* 3. Categories 섹션 */}
      <div className="px-6 mt-12">
        <h2 className="text-[20px] font-bold text-black mb-6">Categories</h2>
        <div className="flex gap-8 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="relative flex flex-col items-center flex-shrink-0"
            >
              <span className={`text-[16px] ${selectedCategory === cat ? "font-bold text-black" : "text-gray-400"}`}>
                {cat}
              </span>
              {selectedCategory === cat && <div className="w-1 h-1 bg-black rounded-full mt-1" />}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Products 그리드 */}
      <div className="px-6 mt-10 grid grid-cols-2 gap-x-5 gap-y-12">
        {filteredProducts.map((product) => (
          <div key={product._id} onClick={() => navigate(`/product/${product._id}`)} className="group cursor-pointer">
            <div className="relative aspect-[3/4] rounded-[30px] overflow-hidden bg-gray-50 mb-4 shadow-sm">
              <img src={product.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="text-[16px] font-black text-black mb-1">{product.price.toFixed(2)}$</div>
            <div className="text-[13px] text-gray-500 font-medium line-clamp-1">{product.name}</div>
          </div>
        ))}
      </div>

      <SearchModal 
        open={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        products={products} 
        onSelect={(id) => navigate(`/product/${id}`)}
      />
    </div>
  );
}