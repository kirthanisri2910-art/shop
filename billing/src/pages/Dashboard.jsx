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
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ color: "#1f2937", fontSize: "26px", margin: 0, fontWeight: "700" }}>Dashboard</h2>
        
        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => navigate('/billing')}
            style={{
              padding: '10px 20px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <MdShoppingCart size={18} /> New Bill
          </button>
          <button 
            onClick={() => navigate('/products')}
            style={{
              padding: '10px 20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <MdAdd size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div className="card" style={{ borderLeftColor: "#10b981" }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <GiReceiveMoney size={28} style={{ color: '#10b981' }} />
            <h3 style={{ margin: 0 }}>Today Sales</h3>
          </div>
          <div className="value" style={{ color: "#10b981" }}>₹{todaySales}</div>
          <div style={{ fontSize: '12px', color: salesGrowth >= 0 ? '#10b981' : '#ef4444', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '3px' }}>
            {salesGrowth >= 0 ? <BiTrendingUp size={16} /> : <BiTrendingDown size={16} />} {Math.abs(salesGrowth)}% vs yesterday
          </div>
        </div>
        <div className="card" style={{ borderLeftColor: "#3b82f6" }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <GiProfit size={28} style={{ color: '#3b82f6' }} />
            <h3 style={{ margin: 0 }}>Today Profit</h3>
          </div>
          <div className="value" style={{ color: "#3b82f6" }}>₹{todayProfit}</div>
        </div>
        <div className="card" style={{ borderLeftColor: "#ef4444" }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <GiBrokenHeart size={28} style={{ color: '#ef4444' }} />
            <h3 style={{ margin: 0 }}>Today Damage</h3>
          </div>
          <div className="value" style={{ color: "#ef4444" }}>₹{todayDamage}</div>
        </div>
        <div className="card" style={{ borderLeftColor: "#10b981" }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <MdCheckCircle size={28} style={{ color: '#10b981' }} />
            <h3 style={{ margin: 0 }}>Net Profit</h3>
          </div>
          <div className="value" style={{ color: "#10b981" }}>₹{netProfit}</div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '5px' }}>Profit - Damages</div>
        </div>
        <div className="card" style={{ borderLeftColor: "#8b5cf6" }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <MdReceipt size={28} style={{ color: '#8b5cf6' }} />
            <h3 style={{ margin: 0 }}>Avg Bill</h3>
          </div>
          <div className="value" style={{ color: "#8b5cf6" }}>₹{avgBill}</div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '5px' }}>{todayBills} bills today</div>
        </div>
      </div>

      {/* Top Products & Low Stock */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        
        {/* Top Selling Products */}
        <div className="box" style={{ borderLeft: "4px solid #10b981" }}>
          <h3 style={{ color: "#10b981", fontSize: "20px", marginBottom: "15px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
            <MdLocalFireDepartment size={22} /> Top Selling Products
          </h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: "600" }}>{item.name}</td>
                  <td>{item.sold} kg</td>
                  <td style={{ fontWeight: "bold", color: "#10b981" }}>₹{item.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Low Stock Alert */}
        <div className="box" style={{ borderLeft: "4px solid #ef4444" }}>
          <h3 style={{ color: "#ef4444", fontSize: "20px", marginBottom: "15px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
            <MdWarning size={22} /> Low Stock Alert
          </h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: "600" }}>{item.name}</td>
                  <td style={{ fontWeight: "bold", color: "#ef4444" }}>{item.stock} {item.unit}</td>
                  <td>
                    <span className={item.stock === 0 ? "badge badge-danger" : "badge badge-warning"}>
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