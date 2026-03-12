import { useState } from "react";
import { MdAdd, MdDelete, MdPerson, MdManageAccounts } from "react-icons/md";

function Settings() {
  const [shopName, setShopName] = useState(localStorage.getItem("shopName") || "");
  const [address, setAddress] = useState(localStorage.getItem("shopAddress") || "");
  const [phone, setPhone] = useState(localStorage.getItem("shopPhone") || "");
  const [gstNo, setGstNo] = useState(localStorage.getItem("shopGST") || "");
  const [workers, setWorkers] = useState(JSON.parse(localStorage.getItem("workers") || "[]"));
  const [managers, setManagers] = useState(JSON.parse(localStorage.getItem("managers") || "[]"));
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [showAddManager, setShowAddManager] = useState(false);
  const [newWorker, setNewWorker] = useState({ name: "", email: "", password: "" });
  const [newManager, setNewManager] = useState({ name: "", email: "", password: "" });

  const handleSave = () => {
    localStorage.setItem("shopName", shopName);
    localStorage.setItem("shopAddress", address);
    localStorage.setItem("shopPhone", phone);
    localStorage.setItem("shopGST", gstNo);
    alert("Settings Saved Successfully!");
  };

  const handleAddWorker = () => {
    if (!newWorker.name || !newWorker.email || !newWorker.password) {
      alert("Fill all fields");
      return;
    }
    const updatedWorkers = [...workers, { ...newWorker, shopName, id: Date.now() }];
    setWorkers(updatedWorkers);
    localStorage.setItem("workers", JSON.stringify(updatedWorkers));
    setNewWorker({ name: "", email: "", password: "" });
    setShowAddWorker(false);
    alert("Worker added successfully!");
  };

  const handleAddManager = () => {
    if (!newManager.name || !newManager.email || !newManager.password) {
      alert("Fill all fields");
      return;
    }
    const updatedManagers = [...managers, { ...newManager, shopName, id: Date.now() }];
    setManagers(updatedManagers);
    localStorage.setItem("managers", JSON.stringify(updatedManagers));
    setNewManager({ name: "", email: "", password: "" });
    setShowAddManager(false);
    alert("Manager added successfully!");
  };

  const handleDeleteWorker = (id) => {
    if (window.confirm("Delete this worker?")) {
      const updatedWorkers = workers.filter(w => w.id !== id);
      setWorkers(updatedWorkers);
      localStorage.setItem("workers", JSON.stringify(updatedWorkers));
    }
  };

  const handleDeleteManager = (id) => {
    if (window.confirm("Delete this manager?")) {
      const updatedManagers = managers.filter(m => m.id !== id);
      setManagers(updatedManagers);
      localStorage.setItem("managers", JSON.stringify(updatedManagers));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h2 className="text-gray-800 text-2xl font-bold mb-5">⚙️ Shop Settings</h2>
      
      <div className="bg-white p-5 rounded-lg shadow-sm mb-5">
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-sm">Shop Name</label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold text-sm">Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows="3"
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold text-sm">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-1 font-semibold text-sm">GST Number (Optional)</label>
          <input
            type="text"
            value={gstNo}
            onChange={(e) => setGstNo(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg text-base font-semibold transition"
        >
          Save Settings
        </button>
      </div>

      {/* Manager Management */}
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", marginTop: "20px" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MdManageAccounts size={24} /> Manager Accounts
          </h3>
          <button
            onClick={() => setShowAddManager(!showAddManager)}
            style={{
              padding: '8px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontWeight: '600'
            }}
          >
            <MdAdd size={18} /> Add Manager
          </button>
        </div>

        {showAddManager && (
          <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
            <input
              placeholder="Manager Name"
              value={newManager.name}
              onChange={(e) => setNewManager({...newManager, name: e.target.value})}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="email"
              placeholder="Manager Email"
              value={newManager.email}
              onChange={(e) => setNewManager({...newManager, email: e.target.value})}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={newManager.password}
              onChange={(e) => setNewManager({...newManager, password: e.target.value})}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <button
              onClick={handleAddManager}
              style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
            >
              Create Manager Account
            </button>
          </div>
        )}

        {managers.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No managers added yet</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {managers.map(manager => (
                <tr key={manager.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px' }}>{manager.name}</td>
                  <td style={{ padding: '10px' }}>{manager.email}</td>
                  <td style={{ padding: '10px' }}>
                    <button
                      onClick={() => handleDeleteManager(manager.id)}
                      style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <MdDelete size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Worker Management */}
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="m-0 flex items-center gap-2 text-lg font-bold">
            <MdPerson size={24} /> Worker Accounts
          </h3>
          <button
            onClick={() => setShowAddWorker(!showAddWorker)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center gap-1 font-semibold transition"
          >
            <MdAdd size={18} /> Add Worker
          </button>
        </div>

        {showAddWorker && (
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <input
              placeholder="Worker Name"
              value={newWorker.name}
              onChange={(e) => setNewWorker({...newWorker, name: e.target.value})}
              className="w-full p-2.5 mb-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <input
              type="email"
              placeholder="Worker Email"
              value={newWorker.email}
              onChange={(e) => setNewWorker({...newWorker, email: e.target.value})}
              className="w-full p-2.5 mb-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <input
              type="password"
              placeholder="Password"
              value={newWorker.password}
              onChange={(e) => setNewWorker({...newWorker, password: e.target.value})}
              className="w-full p-2.5 mb-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <button
              onClick={handleAddWorker}
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
            >
              Create Worker Account
            </button>
          </div>
        )}

        {workers.length === 0 ? (
          <p className="text-gray-500 text-center py-5">No workers added yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2.5 text-left text-sm font-semibold">Name</th>
                  <th className="p-2.5 text-left text-sm font-semibold">Email</th>
                  <th className="p-2.5 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {workers.map(worker => (
                  <tr key={worker.id} className="border-b border-gray-200">
                    <td className="p-2.5">{worker.name}</td>
                    <td className="p-2.5">{worker.email}</td>
                    <td className="p-2.5">
                      <button
                        onClick={() => handleDeleteWorker(worker.id)}
                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-1 text-sm transition"
                      >
                        <MdDelete size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
