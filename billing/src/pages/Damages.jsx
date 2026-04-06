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

  // Auto calculate lossCost 
  const handleFormChange = (field, value) => {
    const updated = { ...form, [field]: value };

    if (field === "productId" || field === "quantity") {
      const product = productMap[field === "productId" ? value : form.productId];
      const qty = toNum(field === "quantity" ? value : form.quantity);
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

    const product = productMap[Number(form.productId)];
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

  //  UI 
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

      <h2 className="text-gray-800 text-2xl font-bold mb-5">🗑️ Damages & Wastage</h2>

      {/* Add Form */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-5">
        <h3 className="text-lg font-bold mb-4">Record Damage</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
          <select
            value={form.productId}
            onChange={e => handleFormChange("productId", Number(e.target.value))}
            className="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} (Stock: {p.stock} {p.unit}){userRole === "owner" ? ` | Cost: ₹${p.costPrice}` : ""}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={e => handleFormChange("quantity", e.target.value)}
            className="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {userRole === "owner" && (
            <input
              type="number"
              placeholder="Loss Cost (₹)"
              value={form.lossCost}
              onChange={e => setForm({ ...form, lossCost: e.target.value })}
              className="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          )}

          <input
            placeholder="Reason"
            value={form.reason}
            onChange={e => handleFormChange("reason", e.target.value)}
            className="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            onClick={handleAdd}
            disabled={!isFormValid}
            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr>
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Product</th>
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Quantity</th>
              {userRole === "owner" && <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Loss Cost</th>}
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Reason</th>
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Date</th>
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {damages.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-10 text-gray-400">No damage records found</td></tr>
            ) : damages.map(d => (
              <tr key={d.id} className={`hover:bg-gray-50 transition ${toNum(d.lossCost) > 200 ? "bg-red-50" : "bg-white"}`}>
                <td className="p-3.5 border-b border-gray-100 text-gray-800 font-semibold">{d.productName}</td>
                <td className="p-3.5 border-b border-gray-100 text-gray-800">{d.quantity} {productMap[d.productId]?.unit || ""}</td>
                {userRole === "owner" && (
                  <td className={`p-3.5 border-b border-gray-100 font-bold ${toNum(d.lossCost) > 200 ? "text-red-600" : "text-red-500"}`}>
                    ₹{d.lossCost}
                    {toNum(d.lossCost) > 200 && <span className="ml-1 text-xs bg-red-100 text-red-700 px-1 rounded">High</span>}
                  </td>
                )}
                <td className="p-3.5 border-b border-gray-100">
                  <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-sm">{d.reason}</span>
                </td>
                <td className="p-3.5 border-b border-gray-100 text-gray-800 text-sm">{new Date(d.date).toLocaleString()}</td>
                <td className="p-3.5 border-b border-gray-100">
                  <button onClick={() => handleEdit(d)} className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded mr-2 text-sm transition">✏️ Edit</button>
                  <button onClick={() => handleDelete(d)} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition">🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <>
          <div onClick={() => setShowEditModal(false)} className="fixed inset-0 bg-black/50 z-[999]" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-2xl z-[1000] w-[90%] max-w-lg">
            <h3 className="mt-0 mb-5 text-xl font-bold">✏️ Edit Damage Record</h3>

            <div className="mb-4">
              <label className="block mb-1 font-semibold text-sm">Product</label>
              <input
                value={editData.productName}
                disabled
                className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 font-semibold text-sm">Quantity *</label>
                <input
                  type="number"
                  value={editData.quantity}
                  onChange={e => handleEditChange("quantity", e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              {userRole === "owner" && (
                <div>
                  <label className="block mb-1 font-semibold text-sm">Loss Cost *</label>
                  <input
                    type="number"
                    value={editData.lossCost}
                    onChange={e => setEditData({ ...editData, lossCost: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              )}
            </div>

            <div className="mb-5">
              <label className="block mb-1 font-semibold text-sm">Reason *</label>
              <input
                value={editData.reason}
                onChange={e => setEditData({ ...editData, reason: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex gap-2.5 justify-end">
              <button onClick={() => setShowEditModal(false)} className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg transition">Cancel</button>
              <button onClick={handleUpdate} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold transition">Update Record</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Damages;
