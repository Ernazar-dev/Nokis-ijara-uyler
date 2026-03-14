import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context
import { AuthProvider } from "./context/AuthContext";

// Komponentler
import ProtectedRoute from "./components/Routes/ProtectedRoute"; // <-- Slash ońlandı
import Navbar from "./components/Navbar/Navbar";

// Betler
import HomePage from "./pages/Client/Home/HomePage";
import LoginPage from "./pages/Auth/Login/LoginPage";
import RegisterPage from "./pages/Auth/Register/RegisterPage";
import FavoritesPage from "./pages/Client/Favorites/FavoritesPage"; // <-- Import bar

// Admin Betleri
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";
import AddHousePage from "./pages/Admin/AddHouse/AddHousePage";
import EditHousePage from "./pages/Admin/EditHouse/EditHousePage";

// SuperAdmin Beti (Jolına dıqqat beriń!)
import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdminDashboard";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <NavbarWrapper />

          <Routes>
            {/* 1. PUBLIC ROUTES */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />

            {/* 2. ADMIN ROUTES */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]} />
              }
            >
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/add-house" element={<AddHousePage />} />
              <Route path="/admin/edit-house/:id" element={<EditHousePage />} />
            </Route>

            {/* 3. SUPER ADMIN ROUTE */}
            <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
              <Route path="/superadmin" element={<SuperAdminDashboard />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <ToastContainer position="top-right" theme="colored" />
      </AuthProvider>
    </Router>
  );
}

// Navbardı jasırıwshı wrapper
const NavbarWrapper = () => {
  const location = useLocation();
  const hideNav = ["/login", "/register"];

  if (hideNav.includes(location.pathname)) return null;
  return <Navbar />;
};

export default App;
