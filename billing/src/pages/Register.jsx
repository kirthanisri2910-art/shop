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
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-5">
      <div className="bg-white p-10 rounded-xl w-full max-w-lg shadow-lg border border-gray-200">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 text-5xl">
            🏪
          </div>
          <h1 className="m-0 text-3xl text-gray-800 font-bold">
            Create Account
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Register your shop to get started
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-semibold text-sm">
            Shop Name *
          </label>
          <input
            type="text"
            placeholder="Enter your shop name"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="w-full px-3.5 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        
        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-semibold text-sm">
            Email Address *
          </label>
          <input
            type="email"
            placeholder="Enter your email address"
            value={shopEmail}
            onChange={(e) => setShopEmail(e.target.value)}
            className="w-full px-3.5 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-semibold text-sm">
            Password *
          </label>
          <input
            type="password"
            placeholder="Create password (min 4 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full px-3.5 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-semibold text-sm">
            Confirm Password *
          </label>
          <input
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full px-3.5 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
          />
        </div>



        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-semibold text-sm">
            Shop Address (Optional)
          </label>
          <input
            type="text"
            placeholder="Enter shop address"
            value={shopAddress}
            onChange={(e) => setShopAddress(e.target.value)}
            className="w-full px-3.5 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
          />
        </div>
        
        <button
          onClick={handleRegister}
          className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-base font-semibold transition mb-5"
        >
          Create Account
        </button>

        <div className="text-center pt-5 border-t border-gray-200">
          <p className="m-0 text-sm text-gray-500">
            Already have an account?{" "}
            <span 
              onClick={() => navigate("/login")}
              className="text-blue-500 font-semibold cursor-pointer underline hover:text-blue-600"
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
