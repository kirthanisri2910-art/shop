import { useState, useMemo } from "react";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";
import { getProducts, saveProducts } from "../services/productService";
import { getSession } from "../services/authService";

// ── constants ─────────────────────────────────────────────────────────────────

const EMPTY_PRODUCT = { name: "", costPrice: "", price: "", unit: "", stock: "" };
const EMPTY_RESTOCK = { id: null, name: "", addStock: "", costPrice: "", price: "" };
const today = () => new Date().toLocaleDateString();

const toNum = (val) => Number(val) || 0;

const stockStatus = (stock) => {
  if (stock === 0) return { label: "❌ Out of Stock", color: "bg-red-100 text-red-700" };
  if (stock <= 5) return { label: "⚠️ Low Stock", color: "bg-yellow-100 text-yellow-700" };
  return { label: "✅ In Stock", color: "bg-green-100 text-green-700" };
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
      price: toNum(newProduct.price),
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
        price: toNum(editData.price),
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
    setRestockData({ id: product.id, name: product.name, addStock: "", costPrice: product.costPrice, price: product.price });
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
        price: toNum(restockData.price) || toNum(p.price),
        lastUpdated: today()
      };
    }));
    setShowRestockModal(false);
    showToast(`Stock updated for ${restockData.name}!`);
  };

  // ── input class ────────────────────────────────────────────────────────────
  const inputCls = "w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

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

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
        <h2 className="text-gray-800 text-2xl font-bold m-0">📦 Products Management</h2>
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-2.5 rounded-lg border-2 border-gray-200 text-sm w-full sm:w-72 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-sm whitespace-nowrap transition"
          >
            ➕ Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse my-4 bg-white rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr>
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Name</th>
              {isOwner && <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Cost Price</th>}
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Selling Price</th>
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Unit</th>
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Stock</th>
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Status</th>
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Last Updated</th>
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr><td colSpan={isOwner ? 8 : 7} className="text-center py-10 text-gray-400">No products found</td></tr>
            ) : filteredProducts.map(p => {
              const status = stockStatus(p.stock);
              return (
                <tr key={p.id} className={`hover:bg-gray-50 transition ${p.stock < 5 ? "bg-red-50" : "bg-white"}`}>
                  <td className="p-3.5 border-b border-gray-100 text-gray-800 font-semibold">{p.name}</td>
                  {isOwner && <td className="p-3.5 border-b border-gray-100 text-gray-800">₹{p.costPrice}</td>}
                  <td className="p-3.5 border-b border-gray-100 text-gray-800">₹{p.price}</td>
                  <td className="p-3.5 border-b border-gray-100 text-gray-800">{p.unit}</td>
                  <td className={`p-3.5 border-b border-gray-100 font-bold ${p.stock < 5 ? "text-red-500" : "text-green-500"}`}>{p.stock}</td>
                  <td className="p-3.5 border-b border-gray-100">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${status.color}`}>{status.label}</span>
                  </td>
                  <td className="p-3.5 border-b border-gray-100 text-gray-800">{p.lastUpdated}</td>
                  <td className="p-3.5 border-b border-gray-100">
                    <button onClick={() => handleRestockOpen(p)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded mr-2 text-sm transition">📦 Restock</button>
                    <button onClick={() => { setEditData(p); setShowEditModal(true); }} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded mr-2 text-sm transition">✏️ Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm transition">🗑️ Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
              <input type="number" placeholder="₹0" value={newProduct.price}
                onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className={inputCls} />
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
            onConfirm={handleAdd} confirmLabel="Add Product" confirmColor="bg-green-500 hover:bg-green-600" />
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
              <input type="number" value={editData.price}
                onChange={e => setEditData({ ...editData, price: e.target.value })} className={inputCls} />
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
            onConfirm={handleUpdate} confirmLabel="Update Product" confirmColor="bg-blue-500 hover:bg-blue-600" />
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
                <input type="number" placeholder={`Current: ₹${restockData.price}`} value={restockData.price}
                  onChange={e => setRestockData({ ...restockData, price: e.target.value })} className={inputCls} />
              </div>
            </div>
          )}
          <ModalActions onCancel={() => setShowRestockModal(false)}
            onConfirm={handleRestockSave} confirmLabel="Add Stock" confirmColor="bg-green-500 hover:bg-green-600" />
        </Modal>
      )}
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
      <button onClick={onCancel} className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg transition">
        Cancel
      </button>
      <button onClick={onConfirm} className={`${confirmColor} text-white px-5 py-2.5 rounded-lg font-semibold transition`}>
        {confirmLabel}
      </button>
    </div>
  );
}

export default Products;
