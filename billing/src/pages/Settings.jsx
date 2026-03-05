import { useState } from "react";
import { MdAdd, MdDelete, MdPerson } from "react-icons/md";

function Settings() {
  const [shopName, setShopName] = useState(localStorage.getItem("shopName") || "");
  const [address, setAddress] = useState(localStorage.getItem("shopAddress") || "");
  const [phone, setPhone] = useState(localStorage.getItem("shopPhone") || "");
  const [gstNo, setGstNo] = useState(localStorage.getItem("shopGST") || "");
  const [workers, setWorkers] = useState(JSON.parse(localStorage.getItem("workers") || "[]"));
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [newWorker, setNewWorker] = useState({ name: "", email: "", password: "" });

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

  const handleDeleteWorker = (id) => {
    if (window.confirm("Delete this worker?")) {
      const updatedWorkers = workers.filter(w => w.id !== id);
      setWorkers(updatedWorkers);
      localStorage.setItem("workers", JSON.stringify(updatedWorkers));
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>⚙️ Shop Settings</h2>
      
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", marginTop: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Shop Name</label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows="3"
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>GST Number (Optional)</label>
          <input
            type="text"
            value={gstNo}
            onChange={(e) => setGstNo(e.target.value)}
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <button
          onClick={handleSave}
          style={{
            width: "100%",
            padding: "12px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Save Settings
        </button>
      </div>

      {/* Worker Management */}
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", marginTop: "20px" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MdPerson size={24} /> Worker Accounts
          </h3>
          <button
            onClick={() => setShowAddWorker(!showAddWorker)}
            style={{
              padding: '8px 16px',
              background: '#10b981',
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
            <MdAdd size={18} /> Add Worker
          </button>
        </div>

        {showAddWorker && (
          <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
            <input
              placeholder="Worker Name"
              value={newWorker.name}
              onChange={(e) => setNewWorker({...newWorker, name: e.target.value})}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="email"
              placeholder="Worker Email"
              value={newWorker.email}
              onChange={(e) => setNewWorker({...newWorker, email: e.target.value})}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={newWorker.password}
              onChange={(e) => setNewWorker({...newWorker, password: e.target.value})}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <button
              onClick={handleAddWorker}
              style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
            >
              Create Worker Account
            </button>
          </div>
        )}

        {workers.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No workers added yet</p>
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
              {workers.map(worker => (
                <tr key={worker.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px' }}>{worker.name}</td>
                  <td style={{ padding: '10px' }}>{worker.email}</td>
                  <td style={{ padding: '10px' }}>
                    <button
                      onClick={() => handleDeleteWorker(worker.id)}
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
    </div>
  );
}

export default Settings;
