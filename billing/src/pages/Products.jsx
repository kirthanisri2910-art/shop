import { useState } from "react";

function Products() {
  const [products, setProducts] = useState([
    { id: 1, name: "Tomatoes", costPrice: 35, price: 40, unit: "kg", stock: 12, lastUpdated: "20/02/2026" },
    { id: 2, name: "Apples", costPrice: 20, price: 30, unit: "kg", stock: 20, lastUpdated: "20/02/2026" },
  ]);

  const [newProduct, setNewProduct] = useState({ name: "", costPrice: "", price: "", unit: "", stock: "" });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAdd = () => {
    if (!newProduct.name || !newProduct.costPrice || !newProduct.price || !newProduct.unit || !newProduct.stock) {
      alert("Fill all fields");
      return;
    }
    const id = Date.now();
    setProducts([...products, { ...newProduct, id, lastUpdated: new Date().toLocaleDateString() }]);
    setNewProduct({ name: "", costPrice: "", price: "", unit: "", stock: "" });
    setShowModal(false);
    setSuccessMsg("✅ Product added successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditData(product);
  };

  const handleUpdate = () => {
    setProducts(products.map(p => 
      p.id === editingId ? { ...editData, lastUpdated: new Date().toLocaleDateString() } : p
    ));
    setEditingId(null);
    setSuccessMsg("✅ Product updated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
        <h2 style={{ margin: 0 }}>📦 Products Management</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
          <input 
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 15px',
              borderRadius: '8px',
              border: '2px solid #e5e7eb',
              fontSize: '14px',
              width: '300px',
              outline: 'none'
            }}
          />
          <button 
            onClick={() => setShowModal(true)}
            style={{ 
              background: '#10b981', 
              color: 'white', 
              padding: '12px 24px', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '15px',
              whiteSpace: 'nowrap'
            }}
          >
            ➕ Add Product
          </button>
        </div>
      </div>
      
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
      
      <table border="1" cellPadding="8" width="100%" style={{ marginBottom: '20px' }}>
        <thead style={{ background: '#f0f0f0' }}>
          <tr>
            <th>Name</th>
            <th>Cost Price</th>
            <th>Selling Price</th>
            <th>Unit</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(p => (
            <tr key={p.id} style={{ background: p.stock < 5 ? '#ffebee' : 'white' }}>
              {editingId === p.id ? (
                <>
                  <td><input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} /></td>
                  <td><input type="number" value={editData.costPrice} onChange={e => setEditData({...editData, costPrice: e.target.value})} /></td>
                  <td><input type="number" value={editData.price} onChange={e => setEditData({...editData, price: e.target.value})} /></td>
                  <td><input value={editData.unit} onChange={e => setEditData({...editData, unit: e.target.value})} style={{ width: '60px' }} /></td>
                  <td><input type="number" value={editData.stock} onChange={e => setEditData({...editData, stock: e.target.value})} /></td>
                  <td colSpan="2">
                    <button onClick={handleUpdate} style={{ background: '#4CAF50', color: 'white', padding: '5px 10px', marginRight: '5px' }}>✔️ Save</button>
                    <button onClick={() => setEditingId(null)} style={{ background: '#f44336', color: 'white', padding: '5px 10px' }}>❌ Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{p.name}</td>
                  <td>₹{p.costPrice}</td>
                  <td>₹{p.price}</td>
                  <td>{p.unit}</td>
                  <td style={{ fontWeight: 'bold', color: p.stock < 5 ? 'red' : 'green' }}>{p.stock}</td>
                  <td>{p.stock === 0 ? '❌ Out of Stock' : p.stock <= 5 ? '⚠️ Low stock' : '✅ In Stock'}</td>
                  <td>{p.lastUpdated}</td>
                  <td>
                    <button onClick={() => handleEdit(p)} style={{ background: '#2196F3', color: 'white', padding: '5px 10px', marginRight: '5px' }}>✏️ Edit</button>
                    <button onClick={() => handleDelete(p.id)} style={{ background: '#f44336', color: 'white', padding: '5px 10px' }}>🗑️ Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <>
          <div 
            onClick={() => setShowModal(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 999
            }}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            zIndex: 1000,
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>➕ Add New Product</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Product Name *</label>
              <input 
                placeholder="Enter product name" 
                value={newProduct.name} 
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} 
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Cost Price *</label>
                <input 
                  type="number" 
                  placeholder="₹0" 
                  value={newProduct.costPrice} 
                  onChange={e => setNewProduct({ ...newProduct, costPrice: e.target.value })} 
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Selling Price *</label>
                <input 
                  type="number" 
                  placeholder="₹0" 
                  value={newProduct.price} 
                  onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} 
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Unit *</label>
                <input 
                  placeholder="kg/pcs/ltr" 
                  value={newProduct.unit} 
                  onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })} 
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Stock *</label>
                <input 
                  type="number" 
                  placeholder="0" 
                  value={newProduct.stock} 
                  onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} 
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} 
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => { setShowModal(false); setNewProduct({ name: "", costPrice: "", price: "", unit: "", stock: "" }); }}
                style={{ background: '#6b7280', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleAdd}
                style={{ background: '#10b981', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '600' }}
              >
                Add Product
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Products;