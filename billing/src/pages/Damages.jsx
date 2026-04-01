import { useState,useEffect } from "react";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

import { getProducts,saveProducts } from "../services/productService";
import { getDamages, saveDamages } from "../services/damageService";

function Damages() {
  const userRole = localStorage.getItem('userRole') || 'owner';
  // Product list with cost prices
  
  const [products, setProducts] = useState([]);
  const [damages, setDamages] = useState([]) 
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [lossCost, setLossCost] = useState("");
  const [reason, setReason] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => setToast({ message: msg, type });
  const [confirmDialog, setConfirmDialog] = useState(null);
   useEffect(() => {
    setProducts(getProducts());
    setDamages(getDamages());
  }, []);

  const handleProductChange = (productName) => {
    setProduct(productName);
    const selectedProduct = products.find(p => p.name === productName);
    if (selectedProduct && quantity) {
      setLossCost(Math.round(selectedProduct.costPrice * parseFloat(quantity)));
    } else if (selectedProduct) {
      setLossCost(selectedProduct.costPrice);
    }
  };

  const handleQuantityChange = (qty) => {
    setQuantity(qty);
    const selectedProduct = products.find(p => p.name === product);
    if (selectedProduct && qty) {
      const numQty = parseFloat(qty);
      if (!isNaN(numQty)) {
        setLossCost(Math.round(selectedProduct.costPrice * numQty));
      }
    }
  };

  const handleAdd = () => {
    if (!product || !quantity || !lossCost || !reason) {
      showToast('Fill all fields', 'error');
      return;
    }
    const selectedProduct = products.find(p => p.name === product);
    if (!selectedProduct) return;

    const qty = parseFloat(quantity);
    if (selectedProduct.stock < qty) {
      showToast(`Only ${selectedProduct.stock} ${selectedProduct.unit} available!`, 'error');
      return;
    }

    const updatedProducts = products.map(p =>
      p.name === product ? { ...p, stock: p.stock - qty } : p
    );
    setProducts(updatedProducts);
    saveProducts(updatedProducts);

    const newDamage = {
      id: Date.now(),
      product,
      quantity,
      lossCost: Number(lossCost),
      reason,
      date: new Date().toISOString()
    };

    const updated = [newDamage, ...getDamages()];
    saveDamages(updated);
    setDamages(updated);

    setProduct("");
    setQuantity("");
    setLossCost("");
    setReason("");
    showToast('Damage record added successfully!', 'success');
    setSuccessMsg('');
  };

  const handleEdit = (damage) => {
    setEditData(damage);
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    const oldDamage = damages.find(d => d.id === editData.id);
    const diff = parseFloat(editData.quantity) - parseFloat(oldDamage.quantity);

    if (diff !== 0) {
      const selectedProduct = products.find(p => p.name === editData.product);
      if (selectedProduct) {
        if (diff > 0 && selectedProduct.stock < diff) {
          showToast(`Only ${selectedProduct.stock} ${selectedProduct.unit} available!`, 'error');
          return;
        }
        const updatedProducts = products.map(p =>
          p.name === editData.product ? { ...p, stock: p.stock - diff } : p
        );
        setProducts(updatedProducts);
        saveProducts(updatedProducts);
      }
    }

    const updated = damages.map(d => d.id === editData.id ? { ...editData, lossCost: Number(editData.lossCost) } : d);
    setDamages(updated);
    saveDamages(updated);
    setShowEditModal(false);
    showToast('Damage record updated successfully!', 'success');
    setSuccessMsg('');
  };

  const handleDelete = (id) => {
    setConfirmDialog({
      message: 'Are you sure you want to delete this damage record?',
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: () => {
        const updated = damages.filter(d => d.id !== id);
        setDamages(updated);
        saveDamages(updated);
        showToast('Record deleted!', 'info');
        setConfirmDialog(null);
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDialog && <ConfirmDialog message={confirmDialog.message} type={confirmDialog.type} confirmText={confirmDialog.confirmText} onConfirm={confirmDialog.onConfirm} onCancel={() => setConfirmDialog(null)} />}
      <h2 className="text-gray-800 text-2xl font-bold mb-5">🗑️ Damages & Wastage</h2>

<div className="bg-white p-5 rounded-lg shadow-sm mb-5">
        <h3 className="text-lg font-bold mb-4">Record Damage</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
          <select
            value={product}
            onChange={(e) => handleProductChange(e.target.value)}
            className="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p.name} value={p.name}>{p.name}{userRole === 'owner' ? ` (Cost: ₹${p.costPrice})` : ''}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantity (kg/pcs)"
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            className="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <input
            type="number"
            placeholder="Loss Cost (₹)"
            value={lossCost}
            onChange={(e) => setLossCost(e.target.value)}
            className="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <input
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <button
            onClick={handleAdd}
            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
          >
            Add
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr>
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Product</th>
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Quantity</th>
              {userRole === 'owner' && <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Loss Cost</th>}
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Reason</th>
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Date</th>
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {damages.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 transition">
                <td className="p-3.5 border-b border-gray-100 text-gray-800 font-semibold">{d.product}</td>
                <td className="p-3.5 border-b border-gray-100 text-gray-800">{d.quantity}</td>
                {userRole === 'owner' && <td className="p-3.5 border-b border-gray-100 font-bold text-red-500">₹{d.lossCost}</td>}
                <td className="p-3.5 border-b border-gray-100">
                  <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-sm">{d.reason}</span>
                </td>
                <td className="p-3.5 border-b border-gray-100 text-gray-800">{new Date(d.date).toLocaleDateString()}</td>
                <td className="p-3.5 border-b border-gray-100">
                  <button onClick={() => handleEdit(d)} className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded mr-2 text-sm transition">✏️ Edit</button>
                  <button onClick={() => handleDelete(d.id)} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition">🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <>
          <div 
            onClick={() => setShowEditModal(false)}
            className="fixed inset-0 bg-black/50 z-[999]"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-2xl z-[1000] w-[90%] max-w-lg">
            <h3 className="mt-0 mb-5 text-xl font-bold">✏️ Edit Damage Record</h3>
            
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-sm">Product *</label>
              <input 
                value={editData.product} 
                onChange={e => setEditData({...editData, product: e.target.value})} 
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 font-semibold text-sm">Quantity *</label>
                <input 
                  value={editData.quantity} 
                  onChange={e => setEditData({...editData, quantity: e.target.value})} 
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-sm">Loss Cost *</label>
                <input 
                  type="number" 
                  value={editData.lossCost} 
                  onChange={e => setEditData({...editData, lossCost: e.target.value})} 
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block mb-1 font-semibold text-sm">Reason *</label>
              <input 
                value={editData.reason} 
                onChange={e => setEditData({...editData, reason: e.target.value})} 
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
              />
            </div>

            <div className="flex gap-2.5 justify-end">
              <button 
                onClick={() => setShowEditModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg cursor-pointer transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdate}
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg cursor-pointer font-semibold transition"
              >
                Update Record
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Damages;
