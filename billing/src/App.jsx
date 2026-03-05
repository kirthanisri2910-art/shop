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
    <nav className="no-print" style={{
      padding: "15px 30px",
      background: "#1f2937",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      flexWrap: "wrap"
    }}>
      <h1 style={{
        color: "white",
        fontSize: "22px",
        fontWeight: "700",
        marginBottom: "0"
      }}>💼 BizBill Pro {userRole === 'worker' && <span style={{fontSize: '12px', background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '4px', marginLeft: '8px'}}>Worker</span>}</h1>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
        {userRole === 'owner' && (
          <>
            <Link to="/" style={{
              color: "white",
              textDecoration: "none",
              padding: "8px 15px",
              borderRadius: "6px",
              background: location.pathname === "/" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
              fontWeight: "500",
              fontSize: "13px",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              border: location.pathname === "/" ? "1px solid rgba(255,255,255,0.3)" : "none"
            }}><MdDashboard size={16} /> Dashboard</Link>
          </>
        )}
        <Link to="/billing" style={{
          color: "white",
          textDecoration: "none",
          padding: "8px 15px",
          borderRadius: "6px",
          background: location.pathname === "/billing" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
          fontWeight: "500",
          fontSize: "13px",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          border: location.pathname === "/billing" ? "1px solid rgba(255,255,255,0.3)" : "none"
        }}><MdShoppingCart size={16} /> Billing</Link>
        {userRole === 'owner' && (
          <>
        <Link to="/products" style={{
          color: "white",
          textDecoration: "none",
          padding: "8px 15px",
          borderRadius: "6px",
          background: location.pathname === "/products" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
          fontWeight: "500",
          fontSize: "13px",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          border: location.pathname === "/products" ? "1px solid rgba(255,255,255,0.3)" : "none"
        }}><MdInventory size={16} /> Products</Link>
        <Link to="/sales" style={{
          color: "white",
          textDecoration: "none",
          padding: "8px 15px",
          borderRadius: "6px",
          background: location.pathname === "/sales" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
          fontWeight: "500",
          fontSize: "13px",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          border: location.pathname === "/sales" ? "1px solid rgba(255,255,255,0.3)" : "none"
        }}><MdReceipt size={16} /> Sales record</Link>
        <Link to="/damages" style={{
          color: "white",
          textDecoration: "none",
          padding: "8px 15px",
          borderRadius: "6px",
          background: location.pathname === "/damages" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
          fontWeight: "500",
          fontSize: "13px",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          border: location.pathname === "/damages" ? "1px solid rgba(255,255,255,0.3)" : "none"
        }}><MdDelete size={16} /> Damages</Link>
        <Link to="/settings" style={{
          color: "white",
          textDecoration: "none",
          padding: "8px 15px",
          borderRadius: "6px",
          background: location.pathname === "/settings" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
          fontWeight: "500",
          fontSize: "13px",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          border: location.pathname === "/settings" ? "1px solid rgba(255,255,255,0.3)" : "none"
        }}><MdSettings size={16} /> Settings</Link>
          </>
        )}
        <button
          onClick={handleLogout}
          style={{
            color: "white",
            padding: "8px 15px",
            borderRadius: "6px",
            background: "#ef4444",
            border: "none",
            fontWeight: "500",
            fontSize: "13px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}
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
          
          {userRole === 'owner' ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/sales" element={<SalesReport />} />
              <Route path="/damages" element={<Damages />} />
              <Route path="/settings" element={<Settings />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/billing" />} />
          )}
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;