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
  const [editingId, setEditingId] = useState(null);
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
    setEditingId(damage.id);
    setEditData(damage);
  };

  const handleUpdate = () => {
    setDamages(damages.map(d => d.id === editingId ? editData : d));
    setEditingId(null);
    setSuccessMsg("✅ Damage record updated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this record?")) {
      setDamages(damages.filter(d => d.id !== id));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🗑️ Damages & Wastage</h2>

      {successMsg && (
        <div style={{ 
          background: '#d4edda', 
          color: '#155724', 
          padding: '12px 20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #c3e6cb',
          fontSize: '15px',
          fontWeight: '600'
        }}>
          {successMsg}
        </div>
      )}

      <div style={{ background: "white", padding: "20px", borderRadius: "8px", marginTop: "20px" }}>
        <h3>Record Damage</h3>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: "10px", marginTop: "15px" }}>
          <select
            value={product}
            onChange={(e) => handleProductChange(e.target.value)}
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
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
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input
            type="number"
            placeholder="Loss Cost (₹)"
            value={lossCost}
            onChange={(e) => setLossCost(e.target.value)}
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <button
            onClick={handleAdd}
            style={{
              padding: "10px 20px",
              background: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Add
          </button>
        </div>
      </div>

      <table border="1" cellPadding="10" width="100%" style={{ background: "white", marginTop: "20px" }}>
        <thead style={{ background: "#f5f5f5" }}>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Loss Cost</th>
            <th>Reason</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {damages.map((d) => (
            <tr key={d.id}>
              {editingId === d.id ? (
                <>
                  <td><input value={editData.product} onChange={e => setEditData({...editData, product: e.target.value})} style={{ width: '100%', padding: '5px' }} /></td>
                  <td><input value={editData.quantity} onChange={e => setEditData({...editData, quantity: e.target.value})} style={{ width: '100%', padding: '5px' }} /></td>
                  <td><input type="number" value={editData.lossCost} onChange={e => setEditData({...editData, lossCost: e.target.value})} style={{ width: '100%', padding: '5px' }} /></td>
                  <td><input value={editData.reason} onChange={e => setEditData({...editData, reason: e.target.value})} style={{ width: '100%', padding: '5px' }} /></td>
                  <td>{d.date}</td>
                  <td>
                    <button onClick={handleUpdate} style={{ padding: "5px 10px", background: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "5px" }}>✔️ Save</button>
                    <button onClick={() => setEditingId(null)} style={{ padding: "5px 10px", background: "#6b7280", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>❌ Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{d.product}</td>
                  <td>{d.quantity}</td>
                  <td style={{ fontWeight: 'bold', color: '#ef4444' }}>₹{d.lossCost}</td>
                  <td><span style={{ background: "#ffebee", padding: "4px 8px", borderRadius: "4px" }}>{d.reason}</span></td>
                  <td>{d.date}</td>
                  <td>
                    <button onClick={() => handleEdit(d)} style={{ padding: "5px 10px", background: "#2196F3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "5px" }}>✏️ Edit</button>
                    <button onClick={() => handleDelete(d.id)} style={{ padding: "5px 10px", background: "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>🗑️ Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Damages;
