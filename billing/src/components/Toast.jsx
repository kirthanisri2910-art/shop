import { useEffect } from 'react';
import { MdCheckCircle, MdError, MdWarning, MdInfo } from 'react-icons/md';

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: { bg: '#d1fae5', color: '#065f46', icon: <MdCheckCircle size={20} /> },
    error: { bg: '#fee2e2', color: '#991b1b', icon: <MdError size={20} /> },
    warning: { bg: '#fef3c7', color: '#92400e', icon: <MdWarning size={20} /> },
    info: { bg: '#dbeafe', color: '#1e40af', icon: <MdInfo size={20} /> }
  };

  const style = styles[type];

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      background: style.bg,
      color: style.color,
      padding: '15px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      zIndex: 9999,
      minWidth: '300px',
      animation: 'slideIn 0.3s ease',
      fontWeight: '600'
    }}>
      {style.icon}
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          marginLeft: 'auto',
          background: 'transparent',
          border: 'none',
          color: style.color,
          cursor: 'pointer',
          fontSize: '18px',
          padding: '0 5px'
        }}
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
