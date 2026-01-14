import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProductNew from "./pages/Admin/AdminProductNew";
import AdminProductEdit from "./pages/Admin/AdminProductEdit";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/admin/products" element={<AdminDashboard />} />
        <Route path="/admin/products/new" element={<AdminProductNew />} />
        <Route path="/admin/products/edit/:id" element={<AdminProductEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;