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
    <div className="min-h-screen bg-slate-50">
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

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-slate-800 text-2xl font-bold m-0">Sales Report</h2>
        <p className="text-slate-400 text-sm mt-1">Track your sales, profit and damages</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
        {/* Quick Filters */}
        <div className="flex gap-1.5 flex-wrap">
          {["today", "weekly", "monthly", "yearly"].map(f => (
            <button
              key={f}
              onClick={() => handleQuickFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm capitalize transition ${
                filter === f && !fromDate
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="hidden sm:block w-px h-6 bg-slate-200" />

        {/* Date Range */}
        <div className="flex gap-2 items-center flex-wrap">
          <input type="date" value={fromDate}
            onChange={e => { setFromDate(e.target.value); setFilter(""); }}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white"
          />
          <span className="text-slate-400 text-sm">→</span>
          <input type="date" value={toDate}
            onChange={e => { setToDate(e.target.value); setFilter(""); }}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white"
          />
          {fromDate && toDate && (
            <button onClick={clearDateFilter}
              className="px-3 py-2 text-slate-400 hover:text-red-500 rounded-lg text-sm transition"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search */}
        <div className="sm:ml-auto relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Bill no / Customer..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 w-full sm:w-56 bg-white"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-5">
        <StatCard label="Total Sales" value={`₹${stats.totalSales}`} accent="border-t-emerald-500" iconColor="text-emerald-500" />
        {isOwner && (
          <>
            <StatCard label="Total Profit" value={`₹${stats.totalProfit}`} accent="border-t-indigo-500" iconColor="text-indigo-500" />
            <StatCard label="Total Damage" value={`₹${stats.totalDamage}`} accent="border-t-red-400" iconColor="text-red-400" />
            <StatCard label="Net Profit" value={`₹${stats.netProfit}`} accent="border-t-emerald-600" iconColor="text-emerald-600" />
          </>
        )}
        <StatCard label="Total Bills" value={searchedSales.length} accent="border-t-blue-400" iconColor="text-blue-400" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Bill No", "Date & Time", "Customer", "Items", "Total"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
                {isOwner && <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Profit</th>}
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchedSales.length === 0 ? (
                <tr>
                  <td colSpan={isOwner ? 7 : 6} className="text-center py-12 text-slate-400 text-sm">
                    No sales records found
                  </td>
                </tr>
              ) : searchedSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50 transition cursor-pointer border-b border-slate-100 last:border-0" onClick={() => setSelectedBill(sale)}>
                  <td className="px-5 py-3.5 text-slate-800 font-semibold text-sm">#{sale.billNo}</td>
                  <td className="px-5 py-3.5 text-slate-500 text-sm">{new Date(sale.date).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-slate-700 font-medium text-sm">{sale.customerName || "-"}</td>
                  <td className="px-5 py-3.5 text-slate-500 text-sm">{sale.cart?.length || 0}</td>
                  <td className="px-5 py-3.5 text-slate-900 font-bold text-sm">₹{sale.total}</td>
                  {isOwner && <td className="px-5 py-3.5 text-emerald-600 font-bold text-sm">₹{sale.profit || 0}</td>}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      {/* View */}
                      <button onClick={e => { e.stopPropagation(); setSelectedBill(sale); }} title="View"
                        className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                      {/* Delete */}
                      {isOwner && (
                        <button onClick={e => { e.stopPropagation(); handleDeleteSale(sale); }} title="Delete"
                          className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition">
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill Detail Modal */}
      {selectedBill && (
        <>
          <div onClick={() => setSelectedBill(null)} className="fixed inset-0 bg-black/50 z-[999]" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl z-[1000] w-[90%] max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-slate-800 text-lg font-bold m-0">Bill #{selectedBill.billNo}</h3>
                <p className="text-slate-400 text-xs mt-0.5">{new Date(selectedBill.date).toLocaleString()}</p>
              </div>
              <div className="flex gap-2 items-center">
                {isOwner && (
                  <button onClick={() => handleDeleteSale(selectedBill)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                )}
                <button onClick={() => setSelectedBill(null)} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition text-lg font-bold">✕</button>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 mb-4 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Customer</span>
                <span className="text-slate-700 font-medium">{selectedBill.customerName || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment</span>
                <span className="text-slate-700 font-medium">{selectedBill.paymentMethod}</span>
              </div>
            </div>

            <table className="w-full border-collapse mb-4">
              <thead>
                <tr className="bg-slate-50">
                  {["Product", "Qty", "Price", "Total"].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedBill.cart?.map((item, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="px-3 py-2.5 text-sm text-slate-700 font-medium">{item.name}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-500">{item.quantity} {item.unit}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-500">₹{item.price}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-800 font-semibold">₹{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-slate-100 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>₹{selectedBill.subtotal}</span></div>
              {selectedBill.discount > 0 && (
                <div className="flex justify-between text-red-500"><span>Discount</span><span>-₹{selectedBill.discount}</span></div>
              )}
              {selectedBill.gst > 0 && (
                <div className="flex justify-between text-slate-500"><span>GST ({selectedBill.gst}%)</span><span>₹{selectedBill.gstAmount}</span></div>
              )}
              <div className="flex justify-between font-bold text-slate-900 text-base border-t border-slate-100 pt-2">
                <span>Total</span><span>₹{selectedBill.total}</span>
              </div>
              {isOwner && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Profit</span><span>₹{selectedBill.profit || 0}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
    </div>
  );
}

function StatCard({ label, value, accent, iconColor }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-5 border-t-4 ${accent} hover:shadow-md transition`}>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-2xl font-bold text-slate-900`}>{value}</p>
    </div>
  );
}

export default SalesReport;
