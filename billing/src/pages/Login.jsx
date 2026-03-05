import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      alert("Enter all fields");
      return;
    }
    
    // Check owner account
    const shops = JSON.parse(localStorage.getItem("shops") || "[]");
    const owner = shops.find(s => s.shopEmail === email && s.password === password);
    
    if (owner) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", "owner");
      localStorage.setItem("shopName", owner.shopName);
      localStorage.setItem("shopAddress", owner.shopAddress || "");
      localStorage.setItem("shopEmail", owner.shopEmail);
      navigate("/");
      return;
    }
    
    // Check worker account
    const workers = JSON.parse(localStorage.getItem("workers") || "[]");
    const worker = workers.find(w => w.email === email && w.password === password);
    
    if (worker) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", "worker");
      localStorage.setItem("userName", worker.name);
      localStorage.setItem("shopName", worker.shopName);
      navigate("/billing");
      return;
    }
    
    alert("Invalid credentials!");
  };

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      background: "#f8f9fa"
    }}>
      <div style={{ 
        background: "white", 
        padding: "50px 40px", 
        borderRadius: "12px",
        width: "420px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        border: "1px solid #e5e7eb"
      }}>
        <div style={{ textAlign: "center", marginBottom: "35px" }}>
          <div style={{ 
            width: "80px",
            height: "80px",
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: "40px"
          }}>💼</div>
          <h1 style={{ 
            margin: "0", 
            fontSize: "26px",
            color: "#1f2937",
            fontWeight: "700"
          }}>Welcome Back</h1>
          <p style={{ 
            margin: "8px 0 0 0", 
            color: "#6b7280",
            fontSize: "14px"
          }}>Sign in to your account</p>
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "8px",
            color: "#374151",
            fontWeight: "600",
            fontSize: "14px"
          }}>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            style={{ 
              width: "100%", 
              padding: "12px 14px", 
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
              transition: "border 0.2s",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>
        
        <div style={{ marginBottom: "30px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "8px",
            color: "#374151",
            fontWeight: "600",
            fontSize: "14px"
          }}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            autoComplete="current-password"
            style={{ 
              width: "100%", 
              padding: "12px 14px", 
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
              transition: "border 0.2s",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>
        
        <button
          onClick={handleLogin}
          style={{ 
            width: "100%", 
            padding: "14px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background 0.2s",
            marginBottom: "20px"
          }}
          onMouseOver={(e) => e.target.style.background = "#2563eb"}
          onMouseOut={(e) => e.target.style.background = "#3b82f6"}
        >
          Sign In
        </button>

        <div style={{ textAlign: "center", paddingTop: "20px", borderTop: "1px solid #e5e7eb" }}>
          <p style={{ margin: "0", fontSize: "14px", color: "#6b7280" }}>
            Don't have an account?{" "}
            <span 
              onClick={() => navigate("/register")}
              style={{ color: "#3b82f6", fontWeight: "600", cursor: "pointer", textDecoration: "underline" }}
            >
              Create account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
