import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MdTrendingUp, MdTrendingDown, MdShoppingCart, MdAdd, MdWarning, MdLocalFireDepartment, MdCheckCircle, MdReceipt } from "react-icons/md";
import { BiRupee, BiTrendingUp, BiTrendingDown } from "react-icons/bi";
import { GiReceiveMoney, GiProfit, GiBrokenHeart } from "react-icons/gi";
import { getProducts } from "../services/productService";
import { getSales } from "../services/salesService";
import { getDamages } from "../services/damageService";
import { getSession } from "../services/sessionService";

function Dashboard() {
  const navigate = useNavigate();
  const { userRole } = getSession();

  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [damages, setDamages] = useState([]);

  useEffect(() => {
    setProducts(getProducts());
    setSales(getSales());
    setDamages(getDamages());
  }, []);

  const todayStr = new Date().toDateString();

  const todaySalesList = useMemo(
    () => sales.filter(s => new Date(s.date).toDateString() === todayStr),
    [sales, todayStr]
  );

  const todayDamageList = useMemo(
    () => damages.filter(d => new Date(d.date).toDateString() === todayStr),
    [damages, todayStr]
  );

  const todaySales = useMemo(() => todaySalesList.reduce((sum, s) => sum + (s.total || 0), 0), [todaySalesList]);
  const todayProfit = useMemo(() => todaySalesList.reduce((sum, s) => sum + (s.profit || 0), 0), [todaySalesList]);
  const todayDamage = useMemo(() => todayDamageList.reduce((sum, d) => sum + (d.lossCost || 0), 0), [todayDamageList]);
  const netProfit = todayProfit - todayDamage;
  const todayBills = todaySalesList.length;
  const avgBill = todayBills > 0 ? Math.round(todaySales / todayBills) : 0;

  const topProducts = useMemo(() => {
    const map = {};
    sales.forEach(sale => {
      (sale.cart || []).forEach(item => {
        if (!map[item.name]) map[item.name] = { sold: 0, revenue: 0, unit: item.unit };
        map[item.name].sold += item.quantity;
        map[item.name].revenue += item.total;
      });
    });
    return Object.entries(map)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [sales]);

  const lowStockItems = useMemo(
    () => products.filter(p => p.stock <= 5),
    [products]
  );


 

  return (
    <div className="max-w-7xl mx-auto p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-slate-800 text-2xl font-bold m-0">Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">Today's overview</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => navigate('/billing')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm flex items-center gap-1.5 transition shadow-sm"
          >
            <MdShoppingCart size={18} /> New Bill
          </button>
          <button
            onClick={() => navigate('/products')}
            className="px-5 py-2.5 bg-white hover:bg-gray-50 text-slate-700 border border-gray-200 rounded-lg font-semibold text-sm flex items-center gap-1.5 transition shadow-sm"
          >
            <MdAdd size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">

        {/* Today Sales */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-2 mb-3">
            <GiReceiveMoney size={20} className="text-indigo-500" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Today Sales</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">₹{todaySales}</div>
          <div className="text-xs text-gray-400 mt-1">{todayBills} bills today</div>
        </div>

        {userRole === 'owner' && (
          <>
            {/* Today Profit */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-3">
                <GiProfit size={20} className="text-emerald-500" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Today Profit</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600">₹{todayProfit}</div>
            </div>

            {/* Today Damage */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-3">
                <GiBrokenHeart size={20} className="text-red-400" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Today Damage</span>
              </div>
              <div className="text-2xl font-bold text-red-500">₹{todayDamage}</div>
            </div>

            {/* Net Profit */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-3">
                <MdCheckCircle size={20} className="text-emerald-500" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Net Profit</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600">₹{netProfit}</div>
              <div className="text-xs text-gray-400 mt-1">Profit - Damages</div>
            </div>
          </>
        )}

        {/* Avg Bill / Total Bills */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-2 mb-3">
            <MdReceipt size={20} className="text-indigo-400" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {userRole === 'owner' ? 'Avg Bill' : 'Total Bills'}
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {userRole === 'owner' ? `₹${avgBill}` : todayBills}
          </div>
          <div className="text-xs text-gray-400 mt-1">{todayBills} bills today</div>
        </div>
      </div>

      {/* Top Products & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Top Selling Products */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <MdLocalFireDepartment size={20} className="text-indigo-500" />
            <h3 className="text-slate-700 text-base font-bold m-0">Top Selling Products</h3>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Product</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Sold</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.length === 0 ? (
                <tr><td colSpan="3" className="text-center py-8 text-gray-400 text-sm">No sales data yet</td></tr>
              ) : topProducts.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3.5 border-b border-gray-100 text-slate-700 font-semibold text-sm">{item.name}</td>
                  <td className="px-5 py-3.5 border-b border-gray-100 text-gray-500 text-sm">{item.sold} {item.unit}</td>
                  <td className="px-5 py-3.5 border-b border-gray-100 font-bold text-emerald-600 text-sm">₹{item.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <MdWarning size={20} className="text-red-400" />
            <h3 className="text-slate-700 text-base font-bold m-0">Low Stock Alert</h3>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Product</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Stock</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.length === 0 ? (
                <tr><td colSpan="3" className="text-center py-8 text-gray-400 text-sm">All products well stocked ✅</td></tr>
              ) : lowStockItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3.5 border-b border-gray-100 text-slate-700 font-semibold text-sm">{item.name}</td>
                  <td className="px-5 py-3.5 border-b border-gray-100 font-semibold text-red-500 text-sm">{item.stock} {item.unit}</td>
                  <td className="px-5 py-3.5 border-b border-gray-100">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                      item.stock === 0 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {item.stock === 0 ? 'Out of Stock' : 'Low Stock'}
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