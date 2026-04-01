import { useState, useMemo } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import { getSales, saveSales } from "../services/salesService";
import { getDamages } from "../services/damageService";
import { getProducts, saveProducts } from "../services/productService";
import { getSession } from "../services/authService";

function SalesReport() {
  const { userRole } = getSession();
  const [filter, setFilter] = useState("today");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [toast, setToast] = useState(null);
  const [salesData, setSalesData] = useState(getSales());

  const sales = salesData;
  const damages = getDamages();

  const handleDeleteSale = (sale) => {
    setConfirmDialog({
      message: `Delete Bill #${sale.billNo}? Stock will be restored.`,
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: () => {
        // Restore stock
        const products = getProducts();
        const updatedProducts = products.map(p => {
          const cartItem = sale.cart?.find(c => c.id === p.id);
          return cartItem ? { ...p, stock: p.stock + cartItem.quantity } : p;
        });
        saveProducts(updatedProducts);

        // Remove sale
        const updated = salesData.filter(s => s.id !== sale.id);
        saveSales(updated);
        setSalesData(updated);
        setSelectedBill(null);
        setConfirmDialog(null);
        setToast({ message: `Bill #${sale.billNo} deleted & stock restored!`, type: 'info' });
      }
    });
  };

  const filteredSales = useMemo(() => {
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      to.setHours(23, 59, 59);
      return sales.filter(s => {
        const d = new Date(s.date);
        return d >= from && d <= to;
      });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return sales.filter(s => {
      const d = new Date(s.date);
      if (filter === "today") return d >= today;
      if (filter === "weekly") { const w = new Date(today); w.setDate(w.getDate() - 7); return d >= w; }
      if (filter === "monthly") { const m = new Date(today); m.setMonth(m.getMonth() - 1); return d >= m; }
      if (filter === "yearly") { const y = new Date(today); y.setFullYear(y.getFullYear() - 1); return d >= y; }
      return true;
    });
  }, [sales, filter, fromDate, toDate]);

  const filteredDamages = useMemo(() => {
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      to.setHours(23, 59, 59);
      return damages.filter(d => {
        const date = new Date(d.date);
        return date >= from && date <= to;
      });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayStr = now.toLocaleDateString();

    return damages.filter(d => {
      // Handle both 'DD/MM/YYYY' locale format and ISO format
      const date = new Date(d.date);
      if (isNaN(date)) return false;
      const dateStr = d.date;

      if (filter === "today") return dateStr === todayStr || date >= today;
      if (filter === "weekly") { const w = new Date(today); w.setDate(w.getDate() - 7); return date >= w; }
      if (filter === "monthly") { const m = new Date(today); m.setMonth(m.getMonth() - 1); return date >= m; }
      if (filter === "yearly") { const y = new Date(today); y.setFullYear(y.getFullYear() - 1); return date >= y; }
      return true;
    });
  }, [damages, filter, fromDate, toDate]);

  const totalSales = filteredSales
    .filter(s => !searchTerm || s.billNo?.toString().includes(searchTerm) || (s.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()))
    .reduce((sum, s) => sum + (s.total || 0), 0);
  const totalProfit = filteredSales
    .filter(s => !searchTerm || s.billNo?.toString().includes(searchTerm) || (s.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()))
    .reduce((sum, s) => sum + (s.profit || 0), 0);
  const totalDamage = filteredDamages.reduce((sum, d) => sum + (d.lossCost || 0), 0);
  const netProfit = totalProfit - totalDamage;

  const searchedSales = filteredSales.filter(s =>
    !searchTerm ||
    s.billNo?.toString().includes(searchTerm) ||
    (s.customerName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuickFilter = (f) => {
    setFilter(f);
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="max-w-7xl mx-auto p-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDialog && <ConfirmDialog message={confirmDialog.message} type={confirmDialog.type} confirmText={confirmDialog.confirmText} onConfirm={confirmDialog.onConfirm} onCancel={() => setConfirmDialog(null)} />}
      <h2 className="text-gray-800 text-2xl font-bold mb-5">📊 Sales Report</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
        {/* Quick Filter */}
        <div className="flex gap-2 flex-wrap">
          {["today", "weekly", "monthly", "yearly"].map(f => (
            <button
              key={f}
              onClick={() => handleQuickFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm capitalize transition ${
                filter === f && !fromDate ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-8 bg-gray-200" />

        {/* Custom Date Filter */}
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="date"
            value={fromDate}
            onChange={e => { setFromDate(e.target.value); setFilter(""); }}
            className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
          <span className="text-gray-500 text-sm">to</span>
          <input
            type="date"
            value={toDate}
            onChange={e => { setToDate(e.target.value); setFilter(""); }}
            className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
          {fromDate && toDate && (
            <button
              onClick={() => { setFromDate(""); setToDate(""); setFilter("today"); }}
              className="px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-200 transition"
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Search */}
        <div className="sm:ml-auto">
          <input
            type="text"
            placeholder="🔍 Bill no / Customer..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-full sm:w-56"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-5">
        <div className="bg-green-500 text-white p-5 rounded-lg text-center shadow-md">
          <h3 className="text-sm font-semibold mb-2">Total Sales</h3>
          <p className="text-3xl font-bold">₹{totalSales}</p>
        </div>
        {userRole === "owner" && (
          <>
            <div className="bg-blue-500 text-white p-5 rounded-lg text-center shadow-md">
              <h3 className="text-sm font-semibold mb-2">Total Profit</h3>
              <p className="text-3xl font-bold">₹{totalProfit}</p>
            </div>
            <div className="bg-red-500 text-white p-5 rounded-lg text-center shadow-md">
              <h3 className="text-sm font-semibold mb-2">Total Damage</h3>
              <p className="text-3xl font-bold">₹{totalDamage}</p>
            </div>
            <div className="bg-green-700 text-white p-5 rounded-lg text-center shadow-md">
              <h3 className="text-sm font-semibold mb-2">Net Profit</h3>
              <p className="text-3xl font-bold">₹{netProfit}</p>
            </div>
          </>
        )}
        <div className="bg-orange-500 text-white p-5 rounded-lg text-center shadow-md">
          <h3 className="text-sm font-semibold mb-2">Total Bills</h3>
          <p className="text-3xl font-bold">{searchedSales.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr>
              <th className="bg-gray-800 text-white p-3.5 text-left text-xs uppercase tracking-wide">Bill No</th>
              <th className="bg-gray-800 text-white p-3.5 text-left text-xs uppercase tracking-wide">Date & Time</th>
              <th className="bg-gray-800 text-white p-3.5 text-left text-xs uppercase tracking-wide">Customer</th>
              <th className="bg-gray-800 text-white p-3.5 text-left text-xs uppercase tracking-wide">Items</th>
              <th className="bg-gray-800 text-white p-3.5 text-left text-xs uppercase tracking-wide">Total</th>
              {userRole === "owner" && <th className="bg-gray-800 text-white p-3.5 text-left text-xs uppercase tracking-wide">Profit</th>}
              <th className="bg-gray-800 text-white p-3.5 text-left text-xs uppercase tracking-wide">Details</th>
            </tr>
          </thead>
          <tbody>
            {searchedSales.length === 0 ? (
              <tr><td colSpan={userRole === "owner" ? 7 : 6} className="text-center py-10 text-gray-400">No sales records found</td></tr>
            ) : searchedSales.map((sale, idx) => {
              const profit = (sale.cart?.reduce((p, item) => p + ((item.price - (item.costPrice || 0)) * item.quantity), 0) || 0) - (sale.discount || 0);
              return (
                <tr key={idx} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedBill(sale)}>
                  <td className="p-3.5 border-b border-gray-100">#{sale.billNo}</td>
                  <td className="p-3.5 border-b border-gray-100">{new Date(sale.date).toLocaleString()}</td>
                  <td className="p-3.5 border-b border-gray-100 font-semibold">{sale.customerName || "-"}</td>
                  <td className="p-3.5 border-b border-gray-100">{sale.cart?.length || 0}</td>
                  <td className="p-3.5 border-b border-gray-100 font-bold">₹{sale.total}</td>
                  {userRole === "owner" && (
                <td className="p-3.5 border-b border-gray-100 text-green-600 font-bold">₹{sale.profit || 0}</td>
              )}
                  <td className="p-3.5 border-b border-gray-100">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedBill(sale); }} className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-xs font-semibold hover:bg-blue-200 transition mr-1">View</button>
                    {userRole === 'owner' && <button onClick={(e) => { e.stopPropagation(); handleDeleteSale(sale); }} className="px-3 py-1 bg-red-100 text-red-600 rounded text-xs font-semibold hover:bg-red-200 transition">Delete</button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bill Detail Modal */}
      {selectedBill && (
        <>
          <div onClick={() => setSelectedBill(null)} className="fixed inset-0 bg-black/50 z-[999]" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl z-[1000] w-[90%] max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Bill #{selectedBill.billNo}</h3>
              <div className="flex gap-2 items-center">
                {userRole === 'owner' && (
                  <button onClick={() => handleDeleteSale(selectedBill)} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition">🗑️ Delete</button>
                )}
                <button onClick={() => setSelectedBill(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-4 space-y-1">
              <p><span className="font-semibold">Date:</span> {selectedBill.date}</p>
              <p><span className="font-semibold">Customer:</span> {selectedBill.customerName || "-"}</p>
              <p><span className="font-semibold">Payment:</span> {selectedBill.paymentMethod}</p>
            </div>

            <table className="w-full border-collapse mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left text-xs font-semibold">Product</th>
                  <th className="p-2 text-left text-xs font-semibold">Qty</th>
                  <th className="p-2 text-left text-xs font-semibold">Price</th>
                  <th className="p-2 text-left text-xs font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedBill.cart?.map((item, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="p-2 text-sm">{item.name}</td>
                    <td className="p-2 text-sm">{item.quantity} {item.unit}</td>
                    <td className="p-2 text-sm">₹{item.price}</td>
                    <td className="p-2 text-sm font-semibold">₹{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t pt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{selectedBill.cart?.reduce((s, i) => s + i.total, 0)}</span></div>
              {selectedBill.discount > 0 && <div className="flex justify-between text-red-500"><span>Discount</span><span>-₹{selectedBill.discount}</span></div>}
              {selectedBill.gst > 0 && <div className="flex justify-between"><span>GST ({selectedBill.gst}%)</span><span>₹{selectedBill.gstAmount}</span></div>}
              <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span>₹{selectedBill.total}</span></div>
              {userRole === "owner" && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Profit</span>
                  <span>₹{selectedBill.profit || 0}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SalesReport;
