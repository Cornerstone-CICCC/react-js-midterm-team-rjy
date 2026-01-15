import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./components/Home";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Success from "./components/SucessRegister";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProductNew from "./pages/Admin/AdminProductNew";
import AdminProductEdit from "./pages/Admin/AdminProductEdit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/success" element={<Success />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/admin/products" element={<AdminDashboard />} />
        <Route path="/admin/products/new" element={<AdminProductNew />} />
        <Route path="/admin/products/edit/:id" element={<AdminProductEdit />} />
      </Routes>
      <Toaster position="bottom-center"/>
    </BrowserRouter>
  );
}

export default App;
