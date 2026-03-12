import { useState } from "react";

function Products() {
  const userRole = localStorage.getItem('userRole') || 'owner';
  const [products, setProducts] = useState([
    { id: 1, name: "Tomatoes", costPrice: 35, price: 40, unit: "kg", stock: 12, lastUpdated: "20/02/2026" },
    { id: 2, name: "Apples", costPrice: 20, price: 30, unit: "kg", stock: 20, lastUpdated: "20/02/2026" },
  ]);

  const [newProduct, setNewProduct] = useState({ name: "", costPrice: "", price: "", unit: "", stock: "" });
  const [showEditModal, setShowEditModal] = useState(false);
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
    setEditData(product);
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    setProducts(products.map(p => 
      p.id === editData.id ? { ...editData, lastUpdated: new Date().toLocaleDateString() } : p
    ));
    setShowEditModal(false);
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
    <div className="max-w-7xl mx-auto p-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
        <h2 className="text-gray-800 text-2xl font-bold m-0">📦 Products Management</h2>
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center w-full sm:w-auto">
          <input 
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2.5 rounded-lg border-2 border-gray-200 text-sm w-full sm:w-72 focus:outline-none focus:border-blue-500"
          />
          <button 
            onClick={() => setShowModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-sm whitespace-nowrap transition"
          >
            ➕ Add Product
          </button>
        </div>
      </div>
      
      {successMsg && (
        <div className="bg-green-100 text-green-800 px-5 py-3 rounded-lg mb-5 border border-green-200 text-sm font-semibold">
          {successMsg}
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse my-4 bg-white rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr>
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Name</th>
              {userRole === 'owner' && <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Cost Price</th>}
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Selling Price</th>
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Unit</th>
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Stock</th>
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Status</th>
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Last Updated</th>
              <th className="bg-gray-800 text-white p-3.5 text-left font-semibold text-xs uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p.id} className={`hover:bg-gray-50 transition ${p.stock < 5 ? 'bg-red-50' : 'bg-white'}`}>
                <td className="p-3.5 border-b border-gray-100 text-gray-800 font-semibold">{p.name}</td>
                {userRole === 'owner' && <td className="p-3.5 border-b border-gray-100 text-gray-800">₹{p.costPrice}</td>}
                <td className="p-3.5 border-b border-gray-100 text-gray-800">₹{p.price}</td>
                <td className="p-3.5 border-b border-gray-100 text-gray-800">{p.unit}</td>
                <td className={`p-3.5 border-b border-gray-100 font-bold ${p.stock < 5 ? 'text-red-500' : 'text-green-500'}`}>{p.stock}</td>
                <td className="p-3.5 border-b border-gray-100 text-gray-800">{p.stock === 0 ? '❌ Out of Stock' : p.stock <= 5 ? '⚠️ Low stock' : '✅ In Stock'}</td>
                <td className="p-3.5 border-b border-gray-100 text-gray-800">{p.lastUpdated}</td>
                <td className="p-3.5 border-b border-gray-100">
                  <button onClick={() => handleEdit(p)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded mr-2 text-sm transition">✏️ Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm transition">🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showModal && (
        <>
          <div 
            onClick={() => setShowModal(false)}
            className="fixed inset-0 bg-black/50 z-[999]"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-2xl z-[1000] w-[90%] max-w-lg">
            <h3 className="mt-0 mb-5 text-xl font-bold">➕ Add New Product</h3>
            
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-sm">Product Name *</label>
              <input 
                placeholder="Enter product name" 
                value={newProduct.name} 
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} 
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {userRole === 'owner' && (
                <div>
                  <label className="block mb-1 font-semibold text-sm">Cost Price *</label>
                  <input 
                    type="number" 
                    placeholder="₹0" 
                    value={newProduct.costPrice} 
                    onChange={e => setNewProduct({ ...newProduct, costPrice: e.target.value })} 
                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                  />
                </div>
              )}
              <div>
                <label className="block mb-1 font-semibold text-sm">Selling Price *</label>
                <input 
                  type="number" 
                  placeholder="₹0" 
                  value={newProduct.price} 
                  onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} 
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block mb-1 font-semibold text-sm">Unit *</label>
                <input 
                  placeholder="kg/pcs/ltr" 
                  value={newProduct.unit} 
                  onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })} 
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-sm">Stock *</label>
                <input 
                  type="number" 
                  placeholder="0" 
                  value={newProduct.stock} 
                  onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} 
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                />
              </div>
            </div>

            <div className="flex gap-2.5 justify-end">
              <button 
                onClick={() => { setShowModal(false); setNewProduct({ name: "", costPrice: "", price: "", unit: "", stock: "" }); }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg cursor-pointer transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleAdd}
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg cursor-pointer font-semibold transition"
              >
                Add Product
              </button>
            </div>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <>
          <div 
            onClick={() => setShowEditModal(false)}
            className="fixed inset-0 bg-black/50 z-[999]"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-2xl z-[1000] w-[90%] max-w-lg">
            <h3 className="mt-0 mb-5 text-xl font-bold">✏️ Edit Product</h3>
            
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-sm">Product Name *</label>
              <input 
                value={editData.name} 
                onChange={e => setEditData({...editData, name: e.target.value})} 
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {userRole === 'owner' && (
                <div>
                  <label className="block mb-1 font-semibold text-sm">Cost Price *</label>
                  <input 
                    type="number" 
                    value={editData.costPrice} 
                    onChange={e => setEditData({...editData, costPrice: e.target.value})} 
                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                  />
                </div>
              )}
              <div>
                <label className="block mb-1 font-semibold text-sm">Selling Price *</label>
                <input 
                  type="number" 
                  value={editData.price} 
                  onChange={e => setEditData({...editData, price: e.target.value})} 
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block mb-1 font-semibold text-sm">Unit *</label>
                <input 
                  value={editData.unit} 
                  onChange={e => setEditData({...editData, unit: e.target.value})} 
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-sm">Stock *</label>
                <input 
                  type="number" 
                  value={editData.stock} 
                  onChange={e => setEditData({...editData, stock: e.target.value})} 
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                />
              </div>
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
                Update Product
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Products;