// pages/MainProducts.tsx
import ProductsList from "../components/ProductsList";
import { AuthProvider } from "../context/AuthContext";

export default function MainProducts() {
  return (
    <div className="min-h-screen bg-white">
      {/* 기존의 중복된 <header> 부분을 완전히 삭제했습니다. 
         이제 헤더는 ProductsList 내부의 코드가 담당합니다. 
      */}
      <main>
        {/* 상품 리스트 컴포넌트 */}
        <AuthProvider>
          <ProductsList />
        </AuthProvider>
      </main>
    </div>
  );
}