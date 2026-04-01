import { useState } from "react";
import { MdAdd, MdDelete, MdPerson, MdManageAccounts } from "react-icons/md";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";
import { getShopInfo, saveShopInfo } from "../services/shopService";
import { getWorkers, saveWorkers, getManagers, saveManagers } from "../services/authService";

function Settings() {
  const info = getShopInfo();
  const [shopName, setShopName] = useState(info.shopName);
  const [address, setAddress] = useState(info.shopAddress);
  const [phone, setPhone] = useState(info.shopPhone);
  const [gstNo, setGstNo] = useState(info.shopGST);
  const [workers, setWorkers] = useState(getWorkers());
  const [managers, setManagers] = useState(getManagers());
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [showAddManager, setShowAddManager] = useState(false);
  const [newWorker, setNewWorker] = useState({ name: "", email: "", password: "" });
  const [newManager, setNewManager] = useState({ name: "", email: "", password: "" });
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => setToast({ message: msg, type });
  const [confirmDialog, setConfirmDialog] = useState(null);

  const handleSave = () => {
    saveShopInfo({ shopName, shopAddress: address, shopPhone: phone, shopGST: gstNo });
    showToast('Settings saved successfully!', 'success');
  };

  const handleAddWorker = () => {
    if (!newWorker.name || !newWorker.email || !newWorker.password) {
      showToast('Fill all fields', 'error');
      return;
    }
    const updatedWorkers = [...workers, { ...newWorker, shopName, id: Date.now() }];
    setWorkers(updatedWorkers);
    saveWorkers(updatedWorkers);
    setNewWorker({ name: "", email: "", password: "" });
    setShowAddWorker(false);
    showToast('Worker added successfully!', 'success');
  };

  const handleAddManager = () => {
    if (!newManager.name || !newManager.email || !newManager.password) {
      showToast('Fill all fields', 'error');
      return;
    }
    const updatedManagers = [...managers, { ...newManager, shopName, id: Date.now() }];
    setManagers(updatedManagers);
    saveManagers(updatedManagers);
    setNewManager({ name: "", email: "", password: "" });
    setShowAddManager(false);
    showToast('Manager added successfully!', 'success');
  };

  const handleDeleteWorker = (id) => {
    setConfirmDialog({
      message: 'Are you sure you want to delete this worker?',
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: () => {
        const updated = workers.filter(w => w.id !== id);
        setWorkers(updated);
        saveWorkers(updated);
        showToast('Worker deleted!', 'info');
        setConfirmDialog(null);
      }
    });
  };

  const handleDeleteManager = (id) => {
    setConfirmDialog({
      message: 'Are you sure you want to delete this manager?',
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: () => {
        const updated = managers.filter(m => m.id !== id);
        setManagers(updated);
        saveManagers(updated);
        showToast('Manager deleted!', 'info');
        setConfirmDialog(null);
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDialog && <ConfirmDialog message={confirmDialog.message} type={confirmDialog.type} confirmText={confirmDialog.confirmText} onConfirm={confirmDialog.onConfirm} onCancel={() => setConfirmDialog(null)} />}
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
      <div className="bg-white p-5 rounded-lg shadow-sm mt-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="m-0 flex items-center gap-2 text-lg font-bold">
            <MdManageAccounts size={24} /> Manager Accounts
          </h3>
          <button
            onClick={() => setShowAddManager(!showAddManager)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center gap-1 font-semibold transition"
          >
            <MdAdd size={18} /> Add Manager
          </button>
        </div>

        {showAddManager && (
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <input
              placeholder="Manager Name"
              value={newManager.name}
              onChange={(e) => setNewManager({...newManager, name: e.target.value})}
              className="w-full p-2.5 mb-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <input
              type="email"
              placeholder="Manager Email"
              value={newManager.email}
              onChange={(e) => setNewManager({...newManager, email: e.target.value})}
              className="w-full p-2.5 mb-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <input
              type="password"
              placeholder="Password"
              value={newManager.password}
              onChange={(e) => setNewManager({...newManager, password: e.target.value})}
              className="w-full p-2.5 mb-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <button
              onClick={handleAddManager}
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
            >
              Create Manager Account
            </button>
          </div>
        )}

        {managers.length === 0 ? (
          <p className="text-gray-500 text-center py-5">No managers added yet</p>
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
                {managers.map(manager => (
                  <tr key={manager.id} className="border-b border-gray-200">
                    <td className="p-2.5">{manager.name}</td>
                    <td className="p-2.5">{manager.email}</td>
                    <td className="p-2.5">
                      <button
                        onClick={() => handleDeleteManager(manager.id)}
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
