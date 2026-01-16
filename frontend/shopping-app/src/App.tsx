import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./components/Home";
import MainProducts from "./pages/MainProducts";
import CartPage from "./pages/CartPage";
import LikesPage from "./pages/LikesPage";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Success from "./components/SucessRegister";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProductNew from "./pages/Admin/AdminProductNew";
import AdminProductEdit from "./pages/Admin/AdminProductEdit";
import Checkout from "./components/Checkout";
import Confirmation from "./components/Confirmation";
import BottomNav from "./components/BottomNav";
import ProductDetail from "./pages/ProductsDetail"; // ✅ 상세 페이지 임포트

function AppContent() {
  const location = useLocation();

  // 하단 바를 숨기고 싶은 경로
  const hideNavPaths = ["/", "/signup", "/signin", "/success"];
  const shouldShowNav = !hideNavPaths.includes(location.pathname);

  return (
    <div className={`min-h-screen ${shouldShowNav ? "pb-20" : ""}`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/shop" element={<MainProducts />} />
        <Route path="/product/:id" element={<ProductDetail />} /> {/* ✅ 경로 설정 확인 */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/likes" element={<LikesPage />} />
        <Route path="/success" element={<Success />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />

        {/* 관리자 페이지 */}
        <Route path="/admin/products" element={<AdminDashboard />} />
        <Route path="/admin/products/new" element={<AdminProductNew />} />
        <Route path="/admin/products/edit/:id" element={<AdminProductEdit />} />
      </Routes>

      {shouldShowNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;