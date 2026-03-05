import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdTrendingUp, MdTrendingDown, MdShoppingCart, MdAdd, MdWarning, MdLocalFireDepartment, MdCheckCircle, MdReceipt } from "react-icons/md";
import { BiRupee, BiTrendingUp, BiTrendingDown } from "react-icons/bi";
import { GiReceiveMoney, GiProfit, GiBrokenHeart } from "react-icons/gi";

function Dashboard() {
  const navigate = useNavigate();
  
  // Dummy data - replace with real data from API later
  const [salesData] = useState([
    { billNo: 1001, date: "2025-01-20", items: 5, total: 450, profit: 120 },
    { billNo: 1002, date: "2025-01-20", items: 3, total: 280, profit: 80 },
    { billNo: 1003, date: "2025-01-20", items: 7, total: 620, profit: 150 },
  ]);

  // Separate damage tracking (not part of sales)
  const [damageData] = useState([
    { item: "Tomatoes", quantity: 2, value: 80, reason: "Spoiled", date: "2025-01-20" },
    { item: "Apples", quantity: 1, value: 30, reason: "Damaged", date: "2025-01-20" },
  ]);

  const [lowStockItems] = useState([
    { name: "Oranges", stock: 3, unit: "kg", minStock: 10 },
    { name: "Apples", stock: 5, unit: "kg", minStock: 15 },
  ]);

  const [topProducts] = useState([
    { name: "Tomato", sold: 45, revenue: 480 },
    { name: "Onion", sold: 38, revenue: 450 },
    { name: "Potato", sold: 32, revenue: 420 },
  ]);

  const todaySales = salesData.reduce((sum, s) => sum + s.total, 0);
  const todayProfit = salesData.reduce((sum, s) => sum + s.profit, 0);
  const todayDamage = damageData.reduce((sum, d) => sum + d.value, 0);
  const netProfit = todayProfit - todayDamage;
  const todayBills = salesData.length;
  const avgBill = todayBills > 0 ? Math.round(todaySales / todayBills) : 0;
  const yesterdaySales = 1200;
  const salesGrowth = ((todaySales - yesterdaySales) / yesterdaySales * 100).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto p-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-gray-800 text-2xl font-bold m-0">Dashboard</h2>
        
        {/* Quick Actions */}
        <div className="flex gap-2.5">
          <button 
            onClick={() => navigate('/billing')}
            className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm flex items-center gap-1 transition"
          >
            <MdShoppingCart size={18} /> New Bill
          </button>
          <button 
            onClick={() => navigate('/products')}
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm flex items-center gap-1 transition"
          >
            <MdAdd size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-5">
        <div className="bg-white p-6 rounded-lg border-l-4 border-green-500 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-2.5 mb-2.5">
            <GiReceiveMoney size={28} className="text-green-500" />
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide m-0">Today Sales</h3>
          </div>
          <div className="text-3xl font-bold text-green-500 my-2">₹{todaySales}</div>
          <div className={`text-xs mt-1 flex items-center gap-1 ${salesGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {salesGrowth >= 0 ? <BiTrendingUp size={16} /> : <BiTrendingDown size={16} />} {Math.abs(salesGrowth)}% vs yesterday
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border-l-4 border-blue-500 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-2.5 mb-2.5">
            <GiProfit size={28} className="text-blue-500" />
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide m-0">Today Profit</h3>
          </div>
          <div className="text-3xl font-bold text-blue-500 my-2">₹{todayProfit}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border-l-4 border-red-500 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-2.5 mb-2.5">
            <GiBrokenHeart size={28} className="text-red-500" />
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide m-0">Today Damage</h3>
          </div>
          <div className="text-3xl font-bold text-red-500 my-2">₹{todayDamage}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border-l-4 border-green-500 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-2.5 mb-2.5">
            <MdCheckCircle size={28} className="text-green-500" />
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide m-0">Net Profit</h3>
          </div>
          <div className="text-3xl font-bold text-green-500 my-2">₹{netProfit}</div>
          <div className="text-xs text-gray-500 mt-1">Profit - Damages</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border-l-4 border-purple-500 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-2.5 mb-2.5">
            <MdReceipt size={28} className="text-purple-500" />
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide m-0">Avg Bill</h3>
          </div>
          <div className="text-3xl font-bold text-purple-500 my-2">₹{avgBill}</div>
          <div className="text-xs text-gray-500 mt-1">{todayBills} bills today</div>
        </div>
      </div>

      {/* Top Products & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        
        {/* Top Selling Products */}
        <div className="bg-white p-6 my-5 border border-gray-200 rounded-lg shadow-sm border-l-4 border-green-500">
          <h3 className="text-green-500 text-xl mb-4 font-bold flex items-center gap-2">
            <MdLocalFireDepartment size={22} /> Top Selling Products
          </h3>
          <table className="w-full border-collapse my-4 bg-white rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr>
                <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Product</th>
                <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Sold</th>
                <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="p-3.5 border-b border-gray-100 text-gray-800 font-semibold">{item.name}</td>
                  <td className="p-3.5 border-b border-gray-100 text-gray-800">{item.sold} kg</td>
                  <td className="p-3.5 border-b border-gray-100 font-bold text-green-500">₹{item.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-6 my-5 border border-gray-200 rounded-lg shadow-sm border-l-4 border-red-500">
          <h3 className="text-red-500 text-xl mb-4 font-bold flex items-center gap-2">
            <MdWarning size={22} /> Low Stock Alert
          </h3>
          <table className="w-full border-collapse my-4 bg-white rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr>
                <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Product</th>
                <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Stock</th>
                <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="p-3.5 border-b border-gray-100 text-gray-800 font-semibold">{item.name}</td>
                  <td className="p-3.5 border-b border-gray-100 font-bold text-red-500">{item.stock} {item.unit}</td>
                  <td className="p-3.5 border-b border-gray-100">
                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${
                      item.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.stock === 0 ? "❌ Out" : "⚠️ Low"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;