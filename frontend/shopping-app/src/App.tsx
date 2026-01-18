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
import { CartProvider } from "./context/CartContext";
import ValidateRoute from "./components/ValidateRoute";

function AppContent() {
  const location = useLocation();

  const hideNavPaths = ["/", "/signup", "/signin", "/success"];
  const shouldShowNav = !hideNavPaths.includes(location.pathname);

  return (
    <div className={`min-h-screen ${shouldShowNav ? "pb-20" : ""}`}>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/success" element={<Success />} />
        <Route path="/shop" element={<MainProducts />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Protegidas */}
        <Route
          path="/cart"
          element={
            <ValidateRoute>
              <CartPage />
            </ValidateRoute>
          }
        />

        <Route
          path="/likes"
          element={
            <ValidateRoute>
              <LikesPage />
            </ValidateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ValidateRoute>
              <Profile />
            </ValidateRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ValidateRoute>
              <EditProfile />
            </ValidateRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ValidateRoute>
              <Checkout />
            </ValidateRoute>
          }
        />

        <Route
          path="/confirmation"
          element={
            <ValidateRoute>
              <Confirmation />
            </ValidateRoute>
          }
        />

        {/* Admin (si quieres protegerlos también) */}
        <Route
          path="/admin/products"
          element={
            <ValidateRoute>
              <AdminDashboard />
            </ValidateRoute>
          }
        />

        <Route
          path="/admin/products/new"
          element={
            <ValidateRoute>
              <AdminProductNew />
            </ValidateRoute>
          }
        />

        <Route
          path="/admin/products/edit/:id"
          element={
            <ValidateRoute>
              <AdminProductEdit />
            </ValidateRoute>
          }
        />
      </Routes>

      {shouldShowNav && <BottomNav />}
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
