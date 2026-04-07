import { MdWarning, MdDelete, MdInfo } from "react-icons/md";

function ConfirmDialog({ message, onConfirm, onCancel, type = "warning", confirmText = "Confirm", cancelText = "Cancel" }) {
  const icons = { warning: <MdWarning size={28} className="text-yellow-500" />, danger: <MdDelete size={28} className="text-red-500" />, info: <MdInfo size={28} className="text-blue-500" /> };
  const btnColors = { warning: "bg-yellow-500 hover:bg-yellow-600", danger: "bg-red-500 hover:bg-red-600", info: "bg-blue-500 hover:bg-blue-600" };

  return (
    <>
      <div onClick={onCancel} className="fixed inset-0 bg-black/50 z-[999]" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl z-[1000] w-[90%] max-w-sm">
        <div className="flex items-center gap-3 mb-3">
          {icons[type]}
          <h3 className="text-lg font-bold text-gray-800 m-0">Are you sure?</h3>
        </div>
        <p className="text-gray-500 text-sm mb-5">{message}</p>
        <div className="flex gap-2.5 justify-end">
          <button onClick={onCancel} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition">
            {cancelText}
          </button>
          <button onClick={onConfirm} className={`px-5 py-2.5 text-white rounded-lg font-semibold transition ${btnColors[type]}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
}

export default ConfirmDialog;
