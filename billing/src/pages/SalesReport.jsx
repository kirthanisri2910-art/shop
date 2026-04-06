import { useState, useMemo } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import { getSales, saveSales } from "../services/salesService";
import { getDamages } from "../services/damageService";
import { getProducts, saveProducts } from "../services/productService";
import { getSession } from "../services/authService";

// ── helpers ──────────────────────────────────────────────────────────────────

const getDateThreshold = (filter) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const offsets = { today: 0, weekly: -7, monthly: -30, yearly: -365 };
  if (!(filter in offsets)) return null;
  const d = new Date(today);
  if (filter === "monthly") d.setMonth(d.getMonth() - 1);
  else if (filter === "yearly") d.setFullYear(d.getFullYear() - 1);
  else d.setDate(d.getDate() + offsets[filter]);
  return d;
};

const filterByDate = (items, filter, fromDate, toDate) => {
  if (fromDate && toDate) {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59);
    return items.filter(item => {
      const d = new Date(item.date);
      return !isNaN(d) && d >= from && d <= to;
    });
  }
  const threshold = getDateThreshold(filter);
  if (!threshold) return items;
  return items.filter(item => {
    const d = new Date(item.date);
    return !isNaN(d) && d >= threshold;
  });
};

const matchesSearch = (sale, term) => {
  if (!term) return true;
  const lower = term.toLowerCase();
  return (
    sale.billNo?.toString().includes(term) ||
    (sale.customerName || "").toLowerCase().includes(lower)
  );
};

// ─────────────────────────────────────────────────────────────────────────────

function SalesReport() {
  const { userRole } = getSession();
  const isOwner = userRole === "owner";

  const [filter, setFilter] = useState("today");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [toast, setToast] = useState(null);
  const [salesData, setSalesData] = useState(getSales);

  const damages = useMemo(() => getDamages(), []);

  const filteredSales = useMemo(
    () => filterByDate(salesData, filter, fromDate, toDate),
    [salesData, filter, fromDate, toDate]
  );

  const filteredDamages = useMemo(
    () => filterByDate(damages, filter, fromDate, toDate),
    [damages, filter, fromDate, toDate]
  );

  const searchedSales = useMemo(
    () => filteredSales.filter(s => matchesSearch(s, searchTerm)),
    [filteredSales, searchTerm]
  );

  const stats = useMemo(() => {
    const totalSales = searchedSales.reduce((sum, s) => sum + (s.total || 0), 0);
    const totalProfit = searchedSales.reduce((sum, s) => sum + (s.profit || 0), 0);
    const totalDamage = filteredDamages.reduce((sum, d) => sum + (d.lossCost || 0), 0);
    return { totalSales, totalProfit, totalDamage, netProfit: totalProfit - totalDamage };
  }, [searchedSales, filteredDamages]);

  const handleQuickFilter = (f) => { setFilter(f); setFromDate(""); setToDate(""); };
  const clearDateFilter = () => { setFromDate(""); setToDate(""); setFilter("today"); };

  const handleDeleteSale = (sale) => {
    setConfirmDialog({
      message: `Delete Bill #${sale.billNo}? Stock will be restored.`,
      type: "danger",
      confirmText: "Delete",
      onConfirm: () => {
        const updatedProducts = getProducts().map(p => {
          const item = sale.cart?.find(c => c.id === p.id);
          return item ? { ...p, stock: p.stock + item.quantity } : p;
        });
        saveProducts(updatedProducts);
        const updated = salesData.filter(s => s.id !== sale.id);
        saveSales(updated);
        setSalesData(updated);
        setSelectedBill(null);
        setConfirmDialog(null);
        setToast({ message: `Bill #${sale.billNo} deleted & stock restored!`, type: "info" });
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          type={confirmDialog.type}
          confirmText={confirmDialog.confirmText}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}

      <h2 className="text-gray-800 text-2xl font-bold mb-5">📊 Sales Report</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
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

        <div className="hidden sm:block w-px h-8 bg-gray-200" />

        <div className="flex gap-2 items-center flex-wrap">
          <input type="date" value={fromDate}
            onChange={e => { setFromDate(e.target.value); setFilter(""); }}
            className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
          <span className="text-gray-500 text-sm">to</span>
          <input type="date" value={toDate}
            onChange={e => { setToDate(e.target.value); setFilter(""); }}
            className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
          {fromDate && toDate && (
            <button onClick={clearDateFilter}
              className="px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-200 transition"
            >
              ✕ Clear
            </button>
          )}
        </div>

        <div className="sm:ml-auto">
          <input type="text" placeholder="🔍 Bill no / Customer..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-full sm:w-56"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-5">
        <StatCard label="Total Sales" value={`₹${stats.totalSales}`} color="bg-green-500" />
        {isOwner && (
          <>
            <StatCard label="Total Profit" value={`₹${stats.totalProfit}`} color="bg-blue-500" />
            <StatCard label="Total Damage" value={`₹${stats.totalDamage}`} color="bg-red-500" />
            <StatCard label="Net Profit" value={`₹${stats.netProfit}`} color="bg-green-700" />
          </>
        )}
        <StatCard label="Total Bills" value={searchedSales.length} color="bg-orange-500" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr>
              {["Bill No", "Date & Time", "Customer", "Items", "Total"].map(h => (
                <th key={h} className="bg-gray-800 text-white p-3.5 text-left text-xs uppercase tracking-wide">{h}</th>
              ))}
              {isOwner && <th className="bg-gray-800 text-white p-3.5 text-left text-xs uppercase tracking-wide">Profit</th>}
              <th className="bg-gray-800 text-white p-3.5 text-left text-xs uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {searchedSales.length === 0 ? (
              <tr>
                <td colSpan={isOwner ? 7 : 6} className="text-center py-10 text-gray-400">
                  No sales records found
                </td>
              </tr>
            ) : searchedSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedBill(sale)}>
                <td className="p-3.5 border-b border-gray-100">#{sale.billNo}</td>
                <td className="p-3.5 border-b border-gray-100">{new Date(sale.date).toLocaleString()}</td>
                <td className="p-3.5 border-b border-gray-100 font-semibold">{sale.customerName || "-"}</td>
                <td className="p-3.5 border-b border-gray-100">{sale.cart?.length || 0}</td>
                <td className="p-3.5 border-b border-gray-100 font-bold">₹{sale.total}</td>
                {isOwner && <td className="p-3.5 border-b border-gray-100 text-green-600 font-bold">₹{sale.profit || 0}</td>}
                <td className="p-3.5 border-b border-gray-100">
                  <button onClick={e => { e.stopPropagation(); setSelectedBill(sale); }}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-xs font-semibold hover:bg-blue-200 transition mr-1">
                    View
                  </button>
                  {isOwner && (
                    <button onClick={e => { e.stopPropagation(); handleDeleteSale(sale); }}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded text-xs font-semibold hover:bg-red-200 transition">
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
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
                {isOwner && (
                  <button onClick={() => handleDeleteSale(selectedBill)}
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition">
                    🗑️ Delete
                  </button>
                )}
                <button onClick={() => setSelectedBill(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-4 space-y-1">
              <p><span className="font-semibold">Date:</span> {new Date(selectedBill.date).toLocaleString()}</p>
              <p><span className="font-semibold">Customer:</span> {selectedBill.customerName || "-"}</p>
              <p><span className="font-semibold">Payment:</span> {selectedBill.paymentMethod}</p>
            </div>

            <table className="w-full border-collapse mb-4">
              <thead>
                <tr className="bg-gray-100">
                  {["Product", "Qty", "Price", "Total"].map(h => (
                    <th key={h} className="p-2 text-left text-xs font-semibold">{h}</th>
                  ))}
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
              <div className="flex justify-between"><span>Subtotal</span><span>₹{selectedBill.subtotal}</span></div>
              {selectedBill.discount > 0 && (
                <div className="flex justify-between text-red-500"><span>Discount</span><span>-₹{selectedBill.discount}</span></div>
              )}
              {selectedBill.gst > 0 && (
                <div className="flex justify-between"><span>GST ({selectedBill.gst}%)</span><span>₹{selectedBill.gstAmount}</span></div>
              )}
              <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span>₹{selectedBill.total}</span></div>
              {isOwner && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Profit</span><span>₹{selectedBill.profit || 0}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className={`${color} text-white p-5 rounded-lg text-center shadow-md`}>
      <h3 className="text-sm font-semibold mb-2">{label}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

export default SalesReport;
