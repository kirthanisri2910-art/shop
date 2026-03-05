import { useState, useMemo } from "react";

function SalesReport() {
  const [filter, setFilter] = useState("today");
  
  const [sales] = useState([
    // Today
    { billNo: 1001, date: new Date().toISOString().split('T')[0] + " 09:30 AM", customer: "Ravi", items: 5, total: 450, profit: 120 },
    { billNo: 1002, date: new Date().toISOString().split('T')[0] + " 11:15 AM", customer: "Priya", items: 3, total: 280, profit: 80 },
    { billNo: 1003, date: new Date().toISOString().split('T')[0] + " 02:45 PM", customer: "Kumar", items: 7, total: 620, profit: 150 },
    { billNo: 1004, date: new Date().toISOString().split('T')[0] + " 04:20 PM", customer: "Lakshmi", items: 4, total: 380, profit: 95 },
    
    // This Week (last 7 days)
    { billNo: 1005, date: new Date(Date.now() - 1*24*60*60*1000).toISOString().split('T')[0] + " 10:00 AM", customer: "Suresh", items: 6, total: 520, profit: 140 },
    { billNo: 1006, date: new Date(Date.now() - 2*24*60*60*1000).toISOString().split('T')[0] + " 03:15 PM", customer: "Meena", items: 8, total: 750, profit: 200 },
    { billNo: 1007, date: new Date(Date.now() - 3*24*60*60*1000).toISOString().split('T')[0] + " 01:30 PM", customer: "Arun", items: 5, total: 490, profit: 130 },
    { billNo: 1008, date: new Date(Date.now() - 5*24*60*60*1000).toISOString().split('T')[0] + " 05:45 PM", customer: "Divya", items: 9, total: 820, profit: 220 },
    
    // This Month (last 30 days)
    { billNo: 1009, date: new Date(Date.now() - 10*24*60*60*1000).toISOString().split('T')[0] + " 12:00 PM", customer: "Vijay", items: 4, total: 360, profit: 90 },
    { billNo: 1010, date: new Date(Date.now() - 15*24*60*60*1000).toISOString().split('T')[0] + " 02:20 PM", customer: "Anita", items: 6, total: 580, profit: 160 },
    { billNo: 1011, date: new Date(Date.now() - 20*24*60*60*1000).toISOString().split('T')[0] + " 11:30 AM", customer: "Ramesh", items: 7, total: 670, profit: 180 },
    { billNo: 1012, date: new Date(Date.now() - 25*24*60*60*1000).toISOString().split('T')[0] + " 04:00 PM", customer: "Sita", items: 5, total: 440, profit: 115 },
    
    // This Year (older data)
    { billNo: 1013, date: new Date(Date.now() - 60*24*60*60*1000).toISOString().split('T')[0] + " 10:15 AM", customer: "Gopal", items: 8, total: 780, profit: 210 },
    { billNo: 1014, date: new Date(Date.now() - 90*24*60*60*1000).toISOString().split('T')[0] + " 03:30 PM", customer: "Radha", items: 6, total: 550, profit: 145 },
    { billNo: 1015, date: new Date(Date.now() - 120*24*60*60*1000).toISOString().split('T')[0] + " 01:45 PM", customer: "Mohan", items: 10, total: 920, profit: 250 },
    { billNo: 1016, date: new Date(Date.now() - 180*24*60*60*1000).toISOString().split('T')[0] + " 05:00 PM", customer: "Gita", items: 4, total: 340, profit: 85 },
  ]);

  // Separate damage data (not part of sales)
  const [damageData] = useState([
    { item: "Tomatoes", quantity: 2, value: 80, date: new Date().toISOString().split('T')[0] },
    { item: "Apples", quantity: 1, value: 30, date: new Date().toISOString().split('T')[0] },
    { item: "Onions", quantity: 3, value: 45, date: new Date(Date.now() - 2*24*60*60*1000).toISOString().split('T')[0] },
  ]);

  const filteredSales = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      
      if (filter === "today") {
        return saleDate >= today;
      } else if (filter === "weekly") {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return saleDate >= weekAgo;
      } else if (filter === "monthly") {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return saleDate >= monthAgo;
      } else if (filter === "yearly") {
        const yearAgo = new Date(today);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        return saleDate >= yearAgo;
      }
      return true;
    });
  }, [sales, filter]);

  const filteredDamages = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return damageData.filter(damage => {
      const damageDate = new Date(damage.date);
      
      if (filter === "today") {
        return damageDate >= today;
      } else if (filter === "weekly") {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return damageDate >= weekAgo;
      } else if (filter === "monthly") {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return damageDate >= monthAgo;
      } else if (filter === "yearly") {
        const yearAgo = new Date(today);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        return damageDate >= yearAgo;
      }
      return true;
    });
  }, [damageData, filter]);

  const totalSales = filteredSales.reduce((sum, s) => sum + s.total, 0);
  const totalProfit = filteredSales.reduce((sum, s) => sum + s.profit, 0);
  const totalDamage = filteredDamages.reduce((sum, d) => sum + d.value, 0);
  const netProfit = totalProfit - totalDamage;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>📊 Sales Report</h2>
        
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={() => setFilter("today")} 
            style={{
              padding: "10px 20px",
              background: filter === "today" ? "#10b981" : "#e5e7eb",
              color: filter === "today" ? "white" : "#374151",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Today
          </button>
          <button 
            onClick={() => setFilter("weekly")} 
            style={{
              padding: "10px 20px",
              background: filter === "weekly" ? "#10b981" : "#e5e7eb",
              color: filter === "weekly" ? "white" : "#374151",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Weekly
          </button>
          <button 
            onClick={() => setFilter("monthly")} 
            style={{
              padding: "10px 20px",
              background: filter === "monthly" ? "#10b981" : "#e5e7eb",
              color: filter === "monthly" ? "white" : "#374151",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Monthly
          </button>
          <button 
            onClick={() => setFilter("yearly")} 
            style={{
              padding: "10px 20px",
              background: filter === "yearly" ? "#10b981" : "#e5e7eb",
              color: filter === "yearly" ? "white" : "#374151",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Yearly
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", margin: "20px 0" }}>
        <div style={{ background: "#4CAF50", color: "white", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
          <h3>Total Sales</h3>
          <h1>₹{totalSales}</h1>
        </div>
        <div style={{ background: "#2196F3", color: "white", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
          <h3>Total Profit</h3>
          <h1>₹{totalProfit}</h1>
        </div>
        <div style={{ background: "#f44336", color: "white", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
          <h3>Total Damage</h3>
          <h1>₹{totalDamage}</h1>
        </div>
        <div style={{ background: "#10b981", color: "white", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
          <h3>Net Profit</h3>
          <h1>₹{netProfit}</h1>
          <p style={{ fontSize: "12px", margin: "5px 0 0 0" }}>Profit - Damages</p>
        </div>
        <div style={{ background: "#FF9800", color: "white", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
          <h3>Total Bills</h3>
          <h1>{filteredSales.length}</h1>
        </div>
      </div>

      <table border="1" cellPadding="10" width="100%" style={{ background: "white", marginTop: "20px" }}>
        <thead style={{ background: "#f5f5f5" }}>
          <tr>
            <th>Bill No</th>
            <th>Date & Time</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale, idx) => (
            <tr key={idx}>
              <td>#{sale.billNo}</td>
              <td>{sale.date}</td>
              <td>{sale.customer}</td>
              <td>{sale.items}</td>
              <td style={{ fontWeight: "bold" }}>₹{sale.total}</td>
              <td style={{ color: "green", fontWeight: "bold" }}>₹{sale.profit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalesReport;
