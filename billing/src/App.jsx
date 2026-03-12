import { Routes, Route, Link, BrowserRouter, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdDashboard, MdShoppingCart, MdInventory, MdReceipt, MdDelete, MdSettings, MdLogout } from "react-icons/md";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Billing from "./pages/Billing";
import Products from "./pages/Products";
import Dashboard from "./pages/Dashboard";
import SalesReport from "./pages/SalesReport";
import Damages from "./pages/Damages";
import Settings from "./pages/Settings";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function NavBar() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const userRole = localStorage.getItem('userRole') || 'owner';

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("shopName");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  // Hide navbar on login and register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav className="px-8 py-4 bg-gray-800 flex justify-between items-center shadow-md sticky top-0 z-[1000] flex-wrap print:hidden">
      <h1 className="text-white text-xl font-bold mb-0">
        💼 BizBill Pro 
        {userRole === 'worker' && <span className="text-xs bg-white/20 px-2 py-1 rounded ml-2">Worker</span>}
        {userRole === 'manager' && <span className="text-xs bg-white/20 px-2 py-1 rounded ml-2">Manager</span>}
      </h1>
      <div className="flex gap-2 flex-wrap items-center">
        {(userRole === 'owner' || userRole === 'manager') && (
          <>
            <Link to="/" className={`text-white no-underline px-4 py-2 rounded-md font-medium text-sm transition flex items-center gap-1 ${
              location.pathname === "/" ? "bg-white/25 border border-white/30" : "bg-white/10 hover:bg-white/20"
            }`}>
              <MdDashboard size={16} /> Dashboard
            </Link>
          </>
        )}
        <Link to="/billing" className={`text-white no-underline px-4 py-2 rounded-md font-medium text-sm transition flex items-center gap-1 ${
          location.pathname === "/billing" ? "bg-white/25 border border-white/30" : "bg-white/10 hover:bg-white/20"
        }`}>
          <MdShoppingCart size={16} /> Billing
        </Link>
        {(userRole === 'owner' || userRole === 'manager') && (
          <>
            <Link to="/products" className={`text-white no-underline px-4 py-2 rounded-md font-medium text-sm transition flex items-center gap-1 ${
              location.pathname === "/products" ? "bg-white/25 border border-white/30" : "bg-white/10 hover:bg-white/20"
            }`}>
              <MdInventory size={16} /> Products
            </Link>
            <Link to="/sales" className={`text-white no-underline px-4 py-2 rounded-md font-medium text-sm transition flex items-center gap-1 ${
              location.pathname === "/sales" ? "bg-white/25 border border-white/30" : "bg-white/10 hover:bg-white/20"
            }`}>
              <MdReceipt size={16} /> Sales record
            </Link>
            <Link to="/damages" className={`text-white no-underline px-4 py-2 rounded-md font-medium text-sm transition flex items-center gap-1 ${
              location.pathname === "/damages" ? "bg-white/25 border border-white/30" : "bg-white/10 hover:bg-white/20"
            }`}>
              <MdDelete size={16} /> Damages
            </Link>
          </>
        )}
        {userRole === 'owner' && (
          <>
            <Link to="/settings" className={`text-white no-underline px-4 py-2 rounded-md font-medium text-sm transition flex items-center gap-1 ${
              location.pathname === "/settings" ? "bg-white/25 border border-white/30" : "bg-white/10 hover:bg-white/20"
            }`}>
              <MdSettings size={16} /> Settings
            </Link>
          </>
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
  const userRole = localStorage.getItem('userRole') || 'owner';
  
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/billing" element={<Billing />} />
          
          {userRole === 'owner' && (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/sales" element={<SalesReport />} />
              <Route path="/damages" element={<Damages />} />
              <Route path="/settings" element={<Settings />} />
            </>
          )}
          
          {userRole === 'manager' && (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/sales" element={<SalesReport />} />
              <Route path="/damages" element={<Damages />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
          
          {userRole === 'worker' && (
            <Route path="*" element={<Navigate to="/billing" />} />
          )}
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;