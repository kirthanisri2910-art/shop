import { MdWarning } from "react-icons/md";

function ConfirmModal({ onSaveAndPrint, onSaveOnly, onDiscard, onCancel }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '25px',
        borderRadius: '10px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <MdWarning size={28} color="#f59e0b" />
          <h3 style={{ margin: 0, color: '#1f2937' }}>Unsaved Bill</h3>
        </div>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>
          Current bill is not saved or printed. Data will be lost if you proceed.
        </p>
        <div style={{ display: 'grid', gap: '10px' }}>
          <button onClick={onSaveAndPrint} className="btn-success" style={{ width: '100%' }}>
            Save & Print
          </button>
          <button onClick={onSaveOnly} className="btn-primary" style={{ width: '100%' }}>
            Save Only
          </button>
          <button onClick={onDiscard} className="btn-warning" style={{ width: '100%' }}>
            Discard
          </button>
          <button onClick={onCancel} style={{ 
            width: '100%', 
            padding: '10px', 
            border: '1px solid #d1d5db', 
            background: 'white',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
