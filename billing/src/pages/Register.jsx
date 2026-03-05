import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [shopName, setShopName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [shopEmail, setShopEmail] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!shopName || !password || !confirmPassword || !shopEmail) {
      alert("Fill all required fields!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (password.length < 4) {
      alert("Password must be at least 4 characters!");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shopEmail)) {
      alert("Enter a valid email address!");
      return;
    }

    // Check if email and shop name combination already exists
    const existingShops = JSON.parse(localStorage.getItem("shops") || "[]");
    const shopExists = existingShops.find(s => 
      s.shopName.toLowerCase() === shopName.toLowerCase() && 
      s.shopEmail === shopEmail
    );
    
    if (shopExists) {
      alert("Shop with this name and email already exists! Please login.");
      return;
    }

    // Save new shop
    const newShop = {
      shopName,
      password,
      shopAddress,
      shopEmail,
      createdAt: new Date().toISOString()
    };

    existingShops.push(newShop);
    localStorage.setItem("shops", JSON.stringify(existingShops));
    
    alert("Registration successful! Please login.");
    navigate("/login");
  };

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      background: "#f8f9fa",
      padding: "20px"
    }}>
      <div style={{ 
        background: "white", 
        padding: "40px", 
        borderRadius: "12px",
        width: "100%",
        maxWidth: "480px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        border: "1px solid #e5e7eb"
      }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
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
          }}>🏪</div>
          <h1 style={{ margin: "0", fontSize: "26px", color: "#1f2937", fontWeight: "700" }}>
            Create Account
          </h1>
          <p style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: "14px" }}>
            Register your shop to get started
          </p>
        </div>
        
        <div style={{ marginBottom: "18px" }}>
          <label style={{ display: "block", marginBottom: "8px", color: "#374151", fontWeight: "600", fontSize: "14px" }}>
            Shop Name *
          </label>
          <input
            type="text"
            placeholder="Enter your shop name"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            style={{ 
              width: "100%", 
              padding: "12px 14px", 
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              boxSizing: "border-box",
              transition: "border 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        
        <div style={{ marginBottom: "18px" }}>
          <label style={{ display: "block", marginBottom: "8px", color: "#374151", fontWeight: "600", fontSize: "14px" }}>
            Email Address *
          </label>
          <input
            type="email"
            placeholder="Enter your email address"
            value={shopEmail}
            onChange={(e) => setShopEmail(e.target.value)}
            style={{ 
              width: "100%", 
              padding: "12px 14px", 
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              boxSizing: "border-box",
              transition: "border 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        <div style={{ marginBottom: "18px" }}>
          <label style={{ display: "block", marginBottom: "8px", color: "#374151", fontWeight: "600", fontSize: "14px" }}>
            Password *
          </label>
          <input
            type="password"
            placeholder="Create password (min 4 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            style={{ 
              width: "100%", 
              padding: "12px 14px", 
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              boxSizing: "border-box",
              transition: "border 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        <div style={{ marginBottom: "18px" }}>
          <label style={{ display: "block", marginBottom: "8px", color: "#374151", fontWeight: "600", fontSize: "14px" }}>
            Confirm Password *
          </label>
          <input
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            style={{ 
              width: "100%", 
              padding: "12px 14px", 
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              boxSizing: "border-box",
              transition: "border 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>



        <div style={{ marginBottom: "25px" }}>
          <label style={{ display: "block", marginBottom: "8px", color: "#374151", fontWeight: "600", fontSize: "14px" }}>
            Shop Address (Optional)
          </label>
          <input
            type="text"
            placeholder="Enter shop address"
            value={shopAddress}
            onChange={(e) => setShopAddress(e.target.value)}
            style={{ 
              width: "100%", 
              padding: "12px 14px", 
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              boxSizing: "border-box",
              transition: "border 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>
        
        <button
          onClick={handleRegister}
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
            marginBottom: "20px",
            transition: "background 0.2s"
          }}
          onMouseOver={(e) => e.target.style.background = "#2563eb"}
          onMouseOut={(e) => e.target.style.background = "#3b82f6"}
        >
          Create Account
        </button>

        <div style={{ textAlign: "center", paddingTop: "20px", borderTop: "1px solid #e5e7eb" }}>
          <p style={{ margin: "0", fontSize: "14px", color: "#6b7280" }}>
            Already have an account?{" "}
            <span 
              onClick={() => navigate("/login")}
              style={{ color: "#3b82f6", fontWeight: "600", cursor: "pointer", textDecoration: "underline" }}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
