import { useState, useMemo } from "react";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";
import { getProducts, saveProducts } from "../services/productService";
import { getSession } from "../services/authService";
import { isProductReady } from "../utils/billingUtils";

// ── constants ─────────────────────────────────────────────────────────────────

const EMPTY_PRODUCT = { name: "", costPrice: "", sellingPrice: "", unit: "", stock: "" };
const EMPTY_RESTOCK = { id: null, name: "", addStock: "", costPrice: "", sellingPrice: "" };
const today = () => new Date().toLocaleDateString();

const toNum = (val) => Number(val) || 0;

const stockStatus = (stock, ready) => {
  if (!ready) return { label: "⏳ Pending", color: "bg-gray-100 text-gray-600" };
  if (stock === 0) return { label: "❌ Out of Stock", color: "bg-red-100 text-red-700" };
  if (stock <= 5) return { label: "⚠️ Low Stock", color: "bg-yellow-100 text-yellow-700" };
  return { label: "✅ Ready for Sale", color: "bg-green-100 text-green-700" };
};

// ── component ─────────────────────────────────────────────────────────────────

function Products() {
  const { userRole } = getSession();
  const isOwner = userRole === "owner";

  // ── state ──────────────────────────────────────────────────────────────────
  const [products, setProducts] = useState(getProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});

  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockData, setRestockData] = useState(EMPTY_RESTOCK);

  // ── helpers ────────────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => setToast({ message: msg, type });

  const persist = (updated) => {
    setProducts(updated);
    saveProducts(updated);
  };

  const filteredProducts = useMemo(
    () => products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [products, searchTerm]
  );

  // ── handlers ───────────────────────────────────────────────────────────────
  const handleAdd = () => {
    const missing = isOwner
      ? !newProduct.name || !newProduct.costPrice || !newProduct.unit || !newProduct.stock
      : !newProduct.name || !newProduct.unit || !newProduct.stock;
    if (missing) { showToast("Fill all required fields", "error"); return; }

    persist([...products, {
      id: `prod_${Date.now()}`,
      name: newProduct.name.trim(),
      costPrice: toNum(newProduct.costPrice),
      sellingPrice: toNum(newProduct.sellingPrice),
      unit: newProduct.unit.trim(),
      stock: toNum(newProduct.stock),
      lastUpdated: today()
    }]);
    setNewProduct(EMPTY_PRODUCT);
    setShowAddModal(false);
    showToast("Product added successfully!");
  };

  const handleUpdate = () => {
    persist(products.map(p =>
      p.id === editData.id ? {
        ...editData,
        costPrice: toNum(editData.costPrice),
        sellingPrice: toNum(editData.sellingPrice),
        stock: toNum(editData.stock),
        lastUpdated: today()
      } : p
    ));
    setShowEditModal(false);
    showToast("Product updated successfully!");
  };

  const handleDelete = (id) => {
    setConfirmDialog({
      message: "Are you sure you want to delete this product?",
      type: "danger",
      confirmText: "Delete",
      onConfirm: () => {
        persist(products.filter(p => p.id !== id));
        showToast("Product deleted!", "info");
        setConfirmDialog(null);
      }
    });
  };

  const handleRestockOpen = (product) => {
    setRestockData({ id: product.id, name: product.name, addStock: "", costPrice: product.costPrice, sellingPrice: product.sellingPrice });
    setShowRestockModal(true);
  };

  const handleRestockSave = () => {
    const addStock = toNum(restockData.addStock);
    if (addStock <= 0) { showToast("Enter valid stock quantity", "error"); return; }

    persist(products.map(p => {
      if (p.id !== restockData.id) return p;
      const oldStock = toNum(p.stock);
      const newCostPrice = toNum(restockData.costPrice) || toNum(p.costPrice);
      const avgCostPrice = oldStock > 0
        ? Math.round(((oldStock * toNum(p.costPrice)) + (addStock * newCostPrice)) / (oldStock + addStock))
        : newCostPrice;
      return {
        ...p,
        stock: oldStock + addStock,
        costPrice: avgCostPrice,
        sellingPrice: toNum(restockData.sellingPrice) || toNum(p.sellingPrice),
        lastUpdated: today()
      };
    }));
    setShowRestockModal(false);
    showToast(`Stock updated for ${restockData.name}!`);
  };

  // ── input class ────────────────────────────────────────────────────────────
  const inputCls = "w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-700";

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-slate-800 text-2xl font-bold m-0">Products</h2>
          <p className="text-gray-400 text-sm mt-1">{products.length} products total</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm w-full sm:w-64 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition shadow-sm flex items-center gap-1.5"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
            Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</th>
                {isOwner && <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Cost Price</th>}
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Selling Price</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Unit</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Stock</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Last Updated</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr><td colSpan={isOwner ? 8 : 7} className="text-center py-12 text-gray-400">No products found</td></tr>
              ) : filteredProducts.map(p => {
                const ready = isProductReady(p);
                const status = stockStatus(p.stock, ready);
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition border-b border-gray-100 last:border-0">
                    <td className="px-5 py-3.5 text-slate-800 font-semibold text-sm">{p.name}</td>
                    {isOwner && <td className="px-5 py-3.5 text-gray-500 text-sm">₹{p.costPrice}</td>}
                    <td className="px-5 py-3.5 text-gray-500 text-sm">{p.sellingPrice ? `₹${p.sellingPrice}` : <span className="text-gray-300">—</span>}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-sm">{p.unit}</td>
                    <td className={`px-5 py-3.5 font-bold text-sm ${p.stock === 0 ? 'text-red-500' : p.stock <= 5 ? 'text-amber-500' : 'text-slate-700'}`}>{p.stock}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        p.stock === 0 ? 'bg-red-50 text-red-600' :
                        p.stock <= 5 ? 'bg-amber-50 text-amber-600' :
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        {p.stock === 0 ? 'Out of Stock' : p.stock <= 5 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-sm">{p.lastUpdated}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        {/* Restock */}
                        <button onClick={() => handleRestockOpen(p)} title="Restock"
                          className="p-1.5 rounded-md text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition">
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M20 7H4M20 7l-4-4M20 7l-4 4M4 17h16M4 17l4-4M4 17l4 4"/>
                          </svg>
                        </button>
                        {/* Edit */}
                        <button onClick={() => { setEditData(p); setShowEditModal(true); }} title="Edit"
                          className="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition">
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        {/* Delete */}
                        <button onClick={() => handleDelete(p.id)} title="Delete"
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition">
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <Modal title="➕ Add New Product" onClose={() => { setShowAddModal(false); setNewProduct(EMPTY_PRODUCT); }}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-sm">Product Name *</label>
            <input placeholder="Enter product name" value={newProduct.name}
              onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {isOwner && (
              <div>
                <label className="block mb-1 font-semibold text-sm">Cost Price *</label>
                <input type="number" placeholder="₹0" value={newProduct.costPrice}
                  onChange={e => setNewProduct({ ...newProduct, costPrice: e.target.value })} className={inputCls} />
              </div>
            )}
            <div>
              <label className="block mb-1 font-semibold text-sm">Selling Price</label>
              <input type="number" placeholder="₹0" value={newProduct.sellingPrice}
                onChange={e => setNewProduct({ ...newProduct, sellingPrice: e.target.value })} className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block mb-1 font-semibold text-sm">Unit *</label>
              <input placeholder="kg/pcs/ltr" value={newProduct.unit}
                onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-sm">Stock *</label>
              <input type="number" placeholder="0" value={newProduct.stock}
                onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} className={inputCls} />
            </div>
          </div>
          <ModalActions onCancel={() => { setShowAddModal(false); setNewProduct(EMPTY_PRODUCT); }}
            onConfirm={handleAdd} confirmLabel="Add Product" confirmColor="bg-indigo-600 hover:bg-indigo-700" />
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <Modal title="✏️ Edit Product" onClose={() => setShowEditModal(false)}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-sm">Product Name *</label>
            <input value={editData.name}
              onChange={e => setEditData({ ...editData, name: e.target.value })} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {isOwner && (
              <div>
                <label className="block mb-1 font-semibold text-sm">Cost Price *</label>
                <input type="number" value={editData.costPrice}
                  onChange={e => setEditData({ ...editData, costPrice: e.target.value })} className={inputCls} />
              </div>
            )}
            <div>
              <label className="block mb-1 font-semibold text-sm">Selling Price *</label>
              <input type="number" value={editData.sellingPrice}
                onChange={e => setEditData({ ...editData, sellingPrice: e.target.value })} className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block mb-1 font-semibold text-sm">Unit *</label>
              <input value={editData.unit}
                onChange={e => setEditData({ ...editData, unit: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-sm">Stock *</label>
              <input type="number" value={editData.stock}
                onChange={e => setEditData({ ...editData, stock: e.target.value })} className={inputCls} />
            </div>
          </div>
          <ModalActions onCancel={() => setShowEditModal(false)}
            onConfirm={handleUpdate} confirmLabel="Update Product" confirmColor="bg-indigo-600 hover:bg-indigo-700" />
        </Modal>
      )}

      {/* Restock Modal */}
      {showRestockModal && (
        <Modal title={`📦 Restock - ${restockData.name}`} onClose={() => setShowRestockModal(false)} maxWidth="max-w-sm">
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-sm">Add Stock Quantity *</label>
            <input type="number" placeholder="Enter quantity to add" value={restockData.addStock} autoFocus
              onChange={e => setRestockData({ ...restockData, addStock: e.target.value })} className={inputCls} />
          </div>
          {isOwner && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 font-semibold text-sm">New Cost Price</label>
                <input type="number" placeholder={`Current: ₹${restockData.costPrice}`} value={restockData.costPrice}
                  onChange={e => setRestockData({ ...restockData, costPrice: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-sm">New Selling Price</label>
                <input type="number" placeholder={`Current: ₹${restockData.sellingPrice}`} value={restockData.sellingPrice}
                  onChange={e => setRestockData({ ...restockData, sellingPrice: e.target.value })} className={inputCls} />
              </div>
            </div>
          )}
          <ModalActions onCancel={() => setShowRestockModal(false)}
            onConfirm={handleRestockSave} confirmLabel="Add Stock" confirmColor="bg-indigo-600 hover:bg-indigo-700" />
        </Modal>
      )}
    </div>
    </div>
  );
}

// ── shared modal components ───────────────────────────────────────────────────

function Modal({ title, onClose, children, maxWidth = "max-w-lg" }) {
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/50 z-[999]" />
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-2xl z-[1000] w-[90%] ${maxWidth}`}>
        <h3 className="mt-0 mb-5 text-xl font-bold">{title}</h3>
        {children}
      </div>
    </>
  );
}

function ModalActions({ onCancel, onConfirm, confirmLabel, confirmColor }) {
  return (
    <div className="flex gap-2.5 justify-end">
      <button onClick={onCancel} className="border border-gray-200 hover:bg-gray-50 text-slate-600 px-5 py-2.5 rounded-lg transition">
        Cancel
      </button>
      <button onClick={onConfirm} className={`${confirmColor} text-white px-5 py-2.5 rounded-lg font-semibold transition`}>
        {confirmLabel}
      </button>
    </div>
  );
}

export default Products;
