import { MdWarning } from "react-icons/md";

function ConfirmModal({ onSaveAndPrint, onSaveOnly, onDiscard, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
      <div className="bg-white p-6 rounded-lg max-w-md w-[90%] shadow-2xl">
        <div className="flex items-center gap-2.5 mb-4">
          <MdWarning size={28} className="text-yellow-500" />
          <h3 className="m-0 text-gray-800 text-lg font-bold">Unsaved Bill</h3>
        </div>
        <p className="text-gray-500 mb-5">
          Current bill is not saved or printed. Data will be lost if you proceed.
        </p>
        <div className="grid gap-2.5">
          <button onClick={onSaveAndPrint} className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition">
            Save & Print
          </button>
          <button onClick={onSaveOnly} className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition">
            Save Only
          </button>
          <button onClick={onDiscard} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition">
            Discard
          </button>
          <button onClick={onCancel} className="w-full p-2.5 border border-gray-300 bg-white hover:bg-gray-50 rounded-md cursor-pointer transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;