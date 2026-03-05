import { useState } from "react";

function Damages() {
  // Product list with cost prices
  const [products] = useState([
    { name: "Tomatoes", costPrice: 40 },
    { name: "Apples", costPrice: 30 },
    { name: "Oranges", costPrice: 50 },
    { name: "Mangoes", costPrice: 80 },
    { name: "Onions", costPrice: 35 },
  ]);

  const [damages, setDamages] = useState([
    { id: 1, product: "Tomatoes", quantity: "2kg", lossCost: 80, reason: "Rotten", date: "2025-01-19" },
    { id: 2, product: "Apples", quantity: "1kg", lossCost: 30, reason: "Damaged", date: "2025-01-20" },
  ]);

  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [lossCost, setLossCost] = useState("");
  const [reason, setReason] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const handleProductChange = (productName) => {
    setProduct(productName);
    const selectedProduct = products.find(p => p.name === productName);
    if (selectedProduct) {
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
      alert("Fill all fields");
      return;
    }
    const newDamage = {
      id: Date.now(),
      product,
      quantity,
      lossCost: Number(lossCost),
      reason,
      date: new Date().toLocaleDateString()
    };
    setDamages([newDamage, ...damages]);
    setProduct("");
    setQuantity("");
    setLossCost("");
    setReason("");
    setSuccessMsg("✅ Damage record added successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleEdit = (damage) => {
    setEditData(damage);
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    setDamages(damages.map(d => d.id === editData.id ? editData : d));
    setShowEditModal(false);
    setSuccessMsg("✅ Damage record updated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this record?")) {
      setDamages(damages.filter(d => d.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-5">
      <h2 className="text-gray-800 text-2xl font-bold mb-5">🗑️ Damages & Wastage</h2>

      {successMsg && (
        <div className="bg-green-100 text-green-800 px-5 py-3 rounded-lg mb-5 border border-green-200 text-sm font-semibold">
          {successMsg}
        </div>
      )}

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
              <option key={p.name} value={p.name}>{p.name} (Cost: ₹{p.costPrice})</option>
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
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Loss Cost</th>
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
                <td className="p-3.5 border-b border-gray-100 font-bold text-red-500">₹{d.lossCost}</td>
                <td className="p-3.5 border-b border-gray-100">
                  <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-sm">{d.reason}</span>
                </td>
                <td className="p-3.5 border-b border-gray-100 text-gray-800">{d.date}</td>
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
