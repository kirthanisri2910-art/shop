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

  const inputCls = "w-full p-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

  const TrashIcon = () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-slate-50">
    <div className="max-w-2xl mx-auto p-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDialog && <ConfirmDialog message={confirmDialog.message} type={confirmDialog.type} confirmText={confirmDialog.confirmText} onConfirm={confirmDialog.onConfirm} onCancel={() => setConfirmDialog(null)} />}

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-slate-900 text-2xl font-bold m-0">Settings</h2>
        <p className="text-slate-400 text-sm mt-1">Manage your shop information and accounts</p>
      </div>

      {/* Shop Info */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-5">
        <h3 className="text-slate-700 text-sm font-semibold uppercase tracking-wide mb-5">Shop Information</h3>

        <div className="mb-4">
          <label className="block mb-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Shop Name</label>
          <input type="text" value={shopName} onChange={e => setShopName(e.target.value)} className={inputCls} />
        </div>
        <div className="mb-4">
          <label className="block mb-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Address</label>
          <textarea value={address} onChange={e => setAddress(e.target.value)} rows="3" className={inputCls} />
        </div>
        <div className="mb-4">
          <label className="block mb-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone Number</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} />
        </div>
        <div className="mb-6">
          <label className="block mb-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">GST Number <span className="normal-case font-normal text-slate-400">(Optional)</span></label>
          <input type="text" value={gstNo} onChange={e => setGstNo(e.target.value)} className={inputCls} />
        </div>
        <button onClick={handleSave} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition shadow-sm">
          Save Settings
        </button>
      </div>

      {/* Manager Accounts */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-5">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <MdManageAccounts size={20} className="text-slate-500" />
            <h3 className="text-slate-900 text-base font-bold m-0">Manager Accounts</h3>
          </div>
          <button
            onClick={() => setShowAddManager(!showAddManager)}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg flex items-center gap-1.5 text-sm font-semibold transition"
          >
            <MdAdd size={16} /> Add Manager
          </button>
        </div>

        {showAddManager && (
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg mb-5 space-y-2.5">
            <input placeholder="Manager Name" value={newManager.name} onChange={e => setNewManager({...newManager, name: e.target.value})} className={inputCls} />
            <input type="email" placeholder="Email" value={newManager.email} onChange={e => setNewManager({...newManager, email: e.target.value})} className={inputCls} />
            <input type="password" placeholder="Password" value={newManager.password} onChange={e => setNewManager({...newManager, password: e.target.value})} className={inputCls} />
            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowAddManager(false)} className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-500 rounded-lg text-sm transition">Cancel</button>
              <button onClick={handleAddManager} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition">Create Account</button>
            </div>
          </div>
        )}

        {managers.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">No managers added yet</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Email</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {managers.map(m => (
                <tr key={m.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
                  <td className="px-4 py-3 text-slate-700 text-sm font-medium">{m.name}</td>
                  <td className="px-4 py-3 text-slate-500 text-sm">{m.email}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDeleteManager(m.id)} title="Delete"
                      className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition">
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Worker Accounts */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <MdPerson size={20} className="text-slate-500" />
            <h3 className="text-slate-900 text-base font-bold m-0">Worker Accounts</h3>
          </div>
          <button
            onClick={() => setShowAddWorker(!showAddWorker)}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg flex items-center gap-1.5 text-sm font-semibold transition"
          >
            <MdAdd size={16} /> Add Worker
          </button>
        </div>

        {showAddWorker && (
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg mb-5 space-y-2.5">
            <input placeholder="Worker Name" value={newWorker.name} onChange={e => setNewWorker({...newWorker, name: e.target.value})} className={inputCls} />
            <input type="email" placeholder="Email" value={newWorker.email} onChange={e => setNewWorker({...newWorker, email: e.target.value})} className={inputCls} />
            <input type="password" placeholder="Password" value={newWorker.password} onChange={e => setNewWorker({...newWorker, password: e.target.value})} className={inputCls} />
            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowAddWorker(false)} className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-500 rounded-lg text-sm transition">Cancel</button>
              <button onClick={handleAddWorker} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition">Create Account</button>
            </div>
          </div>
        )}

        {workers.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">No workers added yet</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Email</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {workers.map(w => (
                <tr key={w.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
                  <td className="px-4 py-3 text-slate-700 text-sm font-medium">{w.name}</td>
                  <td className="px-4 py-3 text-slate-500 text-sm">{w.email}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDeleteWorker(w.id)} title="Delete"
                      className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition">
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </div>
  );
}

export default Settings;
