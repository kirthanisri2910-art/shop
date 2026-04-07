import { useState, useEffect, useMemo } from "react";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";
import { getProducts, saveProducts } from "../services/productService";
import { getDamages, saveDamages } from "../services/damageService";

// ─── Helpers ────────────────────────────────────────────────
const toNum = (val) => Number(val) || 0;

const EMPTY_DAMAGE = { productId: "", quantity: "", lossCost: "", reason: "" };

const applyStockChange = (products, productId, quantity, direction) =>
  products.map(p =>
    p.id === productId ? { ...p, stock: toNum(p.stock) + direction * toNum(quantity) } : p
  );

// ─── Component ──────────────────────────────────────────────
function Damages() {
  const userRole = localStorage.getItem("userRole") || "owner";

  const [products, setProducts] = useState([]);
  const [damages, setDamages] = useState([]);
  const [form, setForm] = useState(EMPTY_DAMAGE);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    setProducts(getProducts());
    setDamages(getDamages());
  }, []);

  //Memoized product map for O(1) lookup 
  const productMap = useMemo(() =>
    Object.fromEntries(products.map(p => [p.id, p])),
    [products]
  );

  const handleFormChange = (field, value) => {
    const updated = { ...form, [field]: value };

    if (field === "productId" || field === "quantity") {
      const productId = field === "productId" ? value : form.productId;
      const qty = toNum(field === "quantity" ? value : form.quantity);
      const product = productMap[productId];
      if (product && qty > 0) {
        updated.lossCost = Math.round(toNum(product.costPrice) * qty);
      }
    }

    setForm(updated);
  };

  //Validation 
  const isFormValid = form.productId && toNum(form.quantity) > 0 && form.reason;

  //  Add Damage 
  const handleAdd = () => {
    if (!isFormValid) { showToast("Fill all required fields", "error"); return; }

    const product = productMap[form.productId];
    const qty = toNum(form.quantity);

    if (product.stock < qty) {
      showToast(`Only ${product.stock} ${product.unit} available!`, "error");
      return;
    }

    const newDamage = {
      id: `damage_${Date.now()}`,
      productId: form.productId,
      productName: product.name,
      quantity: qty,
      lossCost: toNum(form.lossCost),
      reason: form.reason,
      date: new Date().toISOString(),
    };

    const updatedProducts = applyStockChange(products, form.productId, qty, -1);
    setProducts(updatedProducts);
    saveProducts(updatedProducts);

    const updated = [newDamage, ...damages];
    setDamages(updated);
    saveDamages(updated);

    setForm(EMPTY_DAMAGE);
    showToast("Damage record added!", "success");
  };

  // Edit 
  const handleEdit = (damage) => {
    setEditData({ ...damage });
    setShowEditModal(true);
  };

  const handleEditChange = (field, value) => {
    const updated = { ...editData, [field]: value };
    if (field === "quantity") {
      const product = productMap[editData.productId];
      const qty = toNum(value);
      if (product && qty > 0) {
        updated.lossCost = Math.round(toNum(product.costPrice) * qty);
      }
    }
    setEditData(updated);
  };

  const handleUpdate = () => {
    const original = damages.find(d => d.id === editData.id);
    const diff = toNum(editData.quantity) - toNum(original.quantity);

    if (diff !== 0) {
      const product = productMap[editData.productId];
      if (diff > 0 && product && product.stock < diff) {
        showToast(`Only ${product.stock} ${product.unit} available!`, "error");
        return;
      }
      const updatedProducts = applyStockChange(products, editData.productId, Math.abs(diff), diff > 0 ? -1 : 1);
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
    }

    const updated = damages.map(d =>
      d.id === editData.id
        ? { ...editData, quantity: toNum(editData.quantity), lossCost: toNum(editData.lossCost) }
        : d
    );
    setDamages(updated);
    saveDamages(updated);
    setShowEditModal(false);
    showToast("Damage record updated!", "success");
  };

  // Delete 
  const handleDelete = (damage) => {
    setConfirmDialog({
      message: `Delete damage record for ${damage.productName}? Stock will be restored.`,
      type: "danger",
      confirmText: "Delete",
      onConfirm: () => {
        const updatedProducts = applyStockChange(products, damage.productId, damage.quantity, 1);
        setProducts(updatedProducts);
        saveProducts(updatedProducts);

        const updated = damages.filter(d => d.id !== damage.id);
        setDamages(updated);
        saveDamages(updated);
        showToast("Record deleted & stock restored!", "info");
        setConfirmDialog(null);
      },
    });
  };

  const inputCls = "w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-slate-700 bg-white";

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
        <h2 className="text-slate-900 text-2xl font-bold m-0">Damages & Wastage</h2>
        <p className="text-slate-400 text-sm mt-1">{damages.length} records total</p>
      </div>

      {/* Add Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-5">
        <h3 className="text-slate-700 text-sm font-semibold uppercase tracking-wide mb-4">Record Damage</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
          <select
            value={form.productId}
            onChange={e => handleFormChange("productId", e.target.value)}
            className="p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-slate-700 bg-white"
          >
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} (Stock: {p.stock} {p.unit}){userRole === "owner" ? ` | ₹${p.costPrice}` : ""}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={e => handleFormChange("quantity", e.target.value)}
            className="p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-slate-700"
          />

          {userRole === "owner" && (
            <input
              type="number"
              placeholder="Loss Cost (₹)"
              value={form.lossCost}
              onChange={e => setForm({ ...form, lossCost: e.target.value })}
              className="p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-slate-700"
            />
          )}

          <input
            placeholder="Reason"
            value={form.reason}
            onChange={e => handleFormChange("reason", e.target.value)}
            className="p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-slate-700"
          />

          <button
            onClick={handleAdd}
            disabled={!isFormValid}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition shadow-sm"
          >
            Add Record
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Product</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Quantity</th>
                {userRole === "owner" && <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Loss Cost</th>}
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Reason</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Date</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {damages.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12 text-slate-400 text-sm">No damage records found</td></tr>
              ) : damages.map(d => (
                <tr key={d.id} className="hover:bg-slate-50 transition border-b border-slate-100 last:border-0 bg-white">
                  <td className="px-5 py-3.5 text-slate-800 font-medium text-sm">{d.productName}</td>
                  <td className="px-5 py-3.5 text-slate-600 text-sm">{d.quantity} {productMap[d.productId]?.unit || ""}</td>
                  {userRole === "owner" && (
                    <td className="px-5 py-3.5 text-sm">
                      <span className="text-red-500">₹{d.lossCost}</span>
                      {toNum(d.lossCost) > 200 && (
                        <span className="ml-2 text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full border border-red-100">High</span>
                      )}
                    </td>
                  )}
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{d.reason}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-sm">{new Date(d.date).toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      {/* Edit */}
                      <button onClick={() => handleEdit(d)} title="Edit"
                        className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition">
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      {/* Delete */}
                      <button onClick={() => handleDelete(d)} title="Delete"
                        className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition">
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <>
          <div onClick={() => setShowEditModal(false)} className="fixed inset-0 bg-black/50 z-[999]" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-2xl z-[1000] w-[90%] max-w-lg">
            <h3 className="mt-0 mb-5 text-slate-900 text-xl font-bold">Edit Damage Record</h3>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-semibold text-slate-600">Product</label>
              <input value={editData.productName} disabled
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-sm font-semibold text-slate-600">Quantity *</label>
                <input type="number" value={editData.quantity}
                  onChange={e => handleEditChange("quantity", e.target.value)}
                  className={inputCls} />
              </div>
              {userRole === "owner" && (
                <div>
                  <label className="block mb-1 text-sm font-semibold text-slate-600">Loss Cost *</label>
                  <input type="number" value={editData.lossCost}
                    onChange={e => setEditData({ ...editData, lossCost: e.target.value })}
                    className={inputCls} />
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block mb-1 text-sm font-semibold text-slate-600">Reason *</label>
              <input value={editData.reason}
                onChange={e => setEditData({ ...editData, reason: e.target.value })}
                className={inputCls} />
            </div>

            <div className="flex gap-2.5 justify-end">
              <button onClick={() => setShowEditModal(false)}
                className="border border-slate-200 hover:bg-slate-50 text-slate-600 px-5 py-2.5 rounded-lg transition text-sm">
                Cancel
              </button>
              <button onClick={handleUpdate}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition text-sm">
                Update Record
              </button>
            </div>
          </div>
        </>
      )}
    </div>
    </div>
  );
}

export default Damages;
