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
      localStorage.setItem("userName", "Owner");
      localStorage.setItem("shopName", owner.shopName);
      localStorage.setItem("shopAddress", owner.shopAddress || "");
      localStorage.setItem("shopEmail", owner.shopEmail);
      navigate("/");
      return;
    }
    
    // Check manager account
    const managers = JSON.parse(localStorage.getItem("managers") || "[]");
    const manager = managers.find(m => m.email === email && m.password === password);
    
    if (manager) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", "manager");
      localStorage.setItem("userName", manager.name);
      localStorage.setItem("shopName", manager.shopName);
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-12 rounded-xl w-full max-w-md shadow-lg border border-gray-200">
        <div className="text-center mb-9">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 text-5xl">
            💼
          </div>
          <h1 className="m-0 text-3xl text-gray-800 font-bold">Welcome Back</h1>
          <p className="mt-2 text-gray-500 text-sm">Sign in to your account</p>
        </div>
        
        <div className="mb-5">
          <label className="block mb-2 text-gray-700 font-semibold text-sm">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-3.5 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
          />
        </div>
        
        <div className="mb-8">
          <label className="block mb-2 text-gray-700 font-semibold text-sm">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            autoComplete="current-password"
            className="w-full px-3.5 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
          />
        </div>
        
        <button
          onClick={handleLogin}
          className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-base font-semibold transition mb-5"
        >
          Sign In
        </button>

        <div className="text-center pt-5 border-t border-gray-200">
          <p className="m-0 text-sm text-gray-500">
            Don't have an account?{" "}
            <span 
              onClick={() => navigate("/register")}
              className="text-blue-500 font-semibold cursor-pointer underline hover:text-blue-600"
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
