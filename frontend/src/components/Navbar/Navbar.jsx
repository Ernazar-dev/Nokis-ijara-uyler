import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  FiLogOut,
  FiSettings,
  FiShield,
  FiPlus,
  FiHeart,
  FiMenu,
  FiX,
  FiHome,
  FiChevronDown,
} from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";
import myImage from "../../assets/images/profil-adam.png";

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sahifa o'zgarganda menyularni yopish
  useEffect(() => {
    setIsMobileOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 w-full h-16 z-[1005] bg-white border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* --- 1. LOGO --- */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors text-white">
            <FaMapMarkerAlt size={18} />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">
            Nókis<span className="text-blue-600">Ijara</span>
          </span>
        </Link>

        {/* --- 2. DESKTOP NAV --- */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Nav Links */}
              <nav className="flex items-center gap-1 border-r border-slate-200 pr-4">
                <Link
                  to="/favorites"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/favorites")
                      ? "bg-red-50 text-red-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <FiHeart
                    className={isActive("/favorites") ? "fill-red-600" : ""}
                  />
                  Tańlanǵanlar
                </Link>
              </nav>

              {/* Action Buttons */}
              {isAdmin && (
                <Link
                  to="/admin/add-house"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all shadow-sm active:scale-95"
                >
                  <FiPlus />
                  <span>Úy Qosıw</span>
                </Link>
              )}

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border transition-all ${
                    showUserMenu
                      ? "border-blue-300 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-lime flex items-center justify-center text-white text-xs font-bold">
                    <img src={myImage} alt="profile" />
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 px-1 hidden lg:block">
                    {user.name?.split(" ")[0]}
                  </span>
                  <FiChevronDown
                    className={`text-slate-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`}
                  />
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2 border-b border-slate-50">
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                          Profil
                        </p>
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {user.name}
                        </p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <FiSettings /> Admin Panel
                        </Link>
                      )}

                      {user.role === "superadmin" && (
                        <Link
                          to="/superadmin"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-violet-600 hover:bg-violet-50 transition-colors font-medium"
                        >
                          <FiShield /> Super Admin
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full border-t border-slate-50 mt-1"
                      >
                        <FiLogOut /> Shıǵıw
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
              >
                Kiriw
              </Link>
              <Link
                to="/register"
                className="bg-slate-900 hover:bg-black text-white px-5 py-2 rounded-md text-sm font-bold transition-all active:scale-95"
              >
                Registraciya
              </Link>
            </div>
          )}
        </div>

        {/* --- 3. MOBILE TOGGLE --- */}
        <button
          className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* --- 4. MOBILE MENU --- */}
      <div
        className={`fixed inset-x-0 top-16 bg-white border-b border-slate-200 shadow-2xl md:hidden transition-all duration-300 ease-in-out z-[900] ${
          isMobileOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-4 space-y-3">
          {user ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900 leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wider">
                    {user.role}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1">
                <MobileLink
                  to="/"
                  icon={<FiHome />}
                  label="Bas Bet"
                  active={isActive("/")}
                />
                <MobileLink
                  to="/favorites"
                  icon={<FiHeart />}
                  label="Tańlanǵanlar"
                  active={isActive("/favorites")}
                />
                {isAdmin && (
                  <MobileLink
                    to="/admin"
                    icon={<FiSettings />}
                    label="Admin Panel"
                    active={isActive("/admin")}
                  />
                )}
              </div>

              {isAdmin && (
                <Link
                  to="/admin/add-house"
                  className="flex items-center justify-center gap-2 w-full p-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-md shadow-blue-200"
                >
                  <FiPlus size={20} /> Jańa Úy Qosıw
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full p-3 text-red-500 font-bold border border-red-100 rounded-xl hover:bg-red-50 transition-colors"
              >
                <FiLogOut /> Shıǵıw
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/login"
                className="w-full py-3 text-center font-bold text-slate-700 border border-slate-200 rounded-xl"
              >
                Kiriw
              </Link>
              <Link
                to="/register"
                className="w-full py-3 text-center font-bold text-white bg-blue-600 rounded-xl"
              >
                Registraciya
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Yordamchi komponent: Mobil havolalar uchun
const MobileLink = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 p-3.5 rounded-xl font-semibold transition-all ${
      active ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span>{label}</span>
  </Link>
);

export default Navbar;
