function ConfirmModal({ onSaveAndPrint, onSaveOnly, onDiscard, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
      <div className="bg-white p-7 rounded-xl max-w-sm w-[90%] shadow-2xl">

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-amber-500">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h3 className="text-slate-900 text-lg font-bold m-0">Unsaved Bill</h3>
        </div>

        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          This bill has unsaved changes. What would you like to do before continuing?
        </p>

        {/* Buttons */}
        <div className="grid gap-2.5">
          {/* Primary */}
          <button
            onClick={onSaveAndPrint}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg font-semibold text-sm transition shadow-sm"
          >
            Save & Print
          </button>

          {/* Secondary */}
          <button
            onClick={onSaveOnly}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-5 py-3 rounded-lg font-semibold text-sm transition"
          >
            Save Only
          </button>

          {/* Low emphasis */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onDiscard}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 px-5 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Discard
            </button>
            <button
              onClick={onCancel}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 px-5 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
