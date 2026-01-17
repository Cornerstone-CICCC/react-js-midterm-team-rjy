import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchModal from "./SearchModal"; // 경로 확인: ./ 또는 ../components/
import type { SearchProduct } from "./SearchModal";

interface Product extends SearchProduct {
  category?: string; // category가 없을 수도 있으므로 ? 추가
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

  // [에러 방지 핵심 로직] p.category가 있을 때만 toLowerCase()를 실행하도록 수정
  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter((p) => 
        p.category && p.category.toLowerCase() === selectedCategory.toLowerCase()
      );

  return (
    <div className="bg-white min-h-screen pb-20 font-['Lora'] serif overflow-x-hidden">
      {/* 1. Header & 중앙 정렬 컨테이너 시작 */}
      <div className="max-w-[1200px] mx-auto">
        
        <header className="relative flex items-center justify-center px-6 py-6 lg:py-10 bg-white">
          <h1 className="text-[24px] lg:text-[32px] font-black tracking-tighter text-black uppercase">BOUTIQUE</h1>
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="absolute right-6 lg:right-10 p-2"
          >
            <i className="fa-solid fa-magnifying-glass text-[22px] lg:text-[28px] text-black" />
          </button>
        </header>

        {/* 2. 메인 슬라이더 (너비 고정) */}
        <div className="relative w-full h-[480px] lg:h-[650px] overflow-hidden lg:rounded-[40px]">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 transition-all duration-700"
            style={{ backgroundImage: `url(${BANNER_IMAGES[currentSlide]})` }}
          />
          
          <div className="relative h-full flex items-center justify-center px-10">
            <div 
              onClick={() => {
                const targetId = products.length > 0 ? products[currentSlide % products.length]._id : "1";
                navigate(`/product/${targetId}`);
              }}
              className="w-full max-w-[280px] lg:max-w-[380px] aspect-[3/4.5] rounded-[30px] lg:rounded-[45px] overflow-hidden shadow-2xl z-10 cursor-pointer active:scale-95 transition-transform"
            >
              <img src={BANNER_IMAGES[currentSlide]} className="w-full h-full object-cover" alt="Main" />
            </div>

            <button onClick={prevSlide} className="absolute left-4 lg:left-12 z-20 text-black/10 hover:text-black">
              <i className="fa-solid fa-chevron-left text-3xl lg:text-5xl" />
            </button>
            <button onClick={nextSlide} className="absolute right-4 lg:right-12 z-20 text-black/10 hover:text-black">
              <i className="fa-solid fa-chevron-right text-3xl lg:text-5xl" />
            </button>
          </div>
        </div>

        {/* 3. Categories 섹션 */}
        <div className="px-6 lg:px-10 mt-12 lg:mt-20">
          <h2 className="text-[20px] lg:text-[28px] font-bold text-black mb-6">Categories</h2>
          <div className="flex gap-8 lg:gap-14 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="relative flex flex-col items-center flex-shrink-0"
              >
                <span className={`text-[16px] lg:text-[18px] transition-colors ${selectedCategory === cat ? "font-bold text-black" : "text-gray-400"}`}>
                  {cat}
                </span>
                {selectedCategory === cat && <div className="w-1 h-1 bg-black rounded-full mt-1" />}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Products 그리드 (데스크탑 4열 고정) */}
        <div className="px-6 lg:px-10 mt-10 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-x-5 lg:gap-x-8 gap-y-12 lg:gap-y-20">
          {filteredProducts.map((product) => (
            <div 
              key={product._id} 
              onClick={() => navigate(`/product/${product._id}`)} 
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] rounded-[20px] lg:rounded-[30px] overflow-hidden bg-gray-50 mb-4 shadow-sm">
                <img src={product.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={product.name} />
              </div>
              <div className="text-[16px] lg:text-[19px] font-black text-black mb-1">{product.price.toFixed(2)}$</div>
              <div className="text-[13px] lg:text-[15px] text-gray-500 font-medium line-clamp-1">{product.name}</div>
            </div>
          ))}
        </div>

        <div className="h-20" />
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