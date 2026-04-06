import { Routes, Route, Link, BrowserRouter, useLocation, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdDashboard, MdShoppingCart, MdInventory, MdReceipt, MdDelete, MdSettings, MdLogout } from "react-icons/md";
import { getSession, clearSession } from "./services/authService";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Billing from "./pages/Billing";
import Products from "./pages/Products";
import Dashboard from "./pages/Dashboard";
import SalesReport from "./pages/SalesReport";
import Damages from "./pages/Damages";
import Settings from "./pages/Settings";

const navLinkClass = (active) =>
  `text-white no-underline px-4 py-2 rounded-md font-medium text-sm transition flex items-center gap-1 ${
    active ? "bg-white/25 border border-white/30" : "bg-white/10 hover:bg-white/20"
  }`;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  const [isLoggedIn, setIsLoggedIn] = useState(getSession().isLoggedIn);
  const { userRole } = getSession();

  const canManage = userRole === "owner" || userRole === "manager";
  const isOwner = userRole === "owner";

  useEffect(() => {
    const sync = () => setIsLoggedIn(getSession().isLoggedIn);
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const handleLogout = () => {
    clearSession();
    setIsLoggedIn(false);
    navigate("/login");
  };

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav className="px-8 py-4 bg-gray-800 flex justify-between items-center shadow-md sticky top-0 z-[1000] flex-wrap print:hidden">
      <h1 className="text-white text-xl font-bold mb-0">
        💼 BizBill Pro
        {userRole === "worker" && <span className="text-xs bg-white/20 px-2 py-1 rounded ml-2">Worker</span>}
        {userRole === "manager" && <span className="text-xs bg-white/20 px-2 py-1 rounded ml-2">Manager</span>}
      </h1>

      <div className="flex gap-2 flex-wrap items-center">
        {canManage && (
          <Link to="/" className={navLinkClass(pathname === "/")}>
            <MdDashboard size={16} /> Dashboard
          </Link>
        )}

        <Link to="/billing" className={navLinkClass(pathname === "/billing")}>
          <MdShoppingCart size={16} /> Billing
        </Link>

        {canManage && (
          <>
            <Link to="/products" className={navLinkClass(pathname === "/products")}>
              <MdInventory size={16} /> Products
            </Link>
            <Link to="/sales" className={navLinkClass(pathname === "/sales")}>
              <MdReceipt size={16} /> Sales
            </Link>
            <Link to="/damages" className={navLinkClass(pathname === "/damages")}>
              <MdDelete size={16} /> Damages
            </Link>
          </>
        )}

        {isOwner && (
          <Link to="/settings" className={navLinkClass(pathname === "/settings")}>
            <MdSettings size={16} /> Settings
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="text-white px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 border-none font-medium text-sm cursor-pointer flex items-center gap-1 transition"
        >
          <MdLogout size={16} /> Logout
        </button>
      </div>
    </nav>
  );
}

function App() {
  const { userRole } = getSession();
  const canManage = userRole === "owner" || userRole === "manager";
  const isOwner = userRole === "owner";

  return (
    <BrowserRouter>
      <ScrollToTop />
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/billing" element={<Billing />} />

        {canManage && (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/sales" element={<SalesReport />} />
            <Route path="/damages" element={<Damages />} />
          </>
        )}

        {isOwner && <Route path="/settings" element={<Settings />} />}

        <Route path="*" element={<Navigate to={canManage ? "/" : "/billing"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
