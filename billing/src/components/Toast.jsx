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
    success: { bg: 'bg-green-100', color: 'text-green-800', icon: <MdCheckCircle size={20} /> },
    error: { bg: 'bg-red-100', color: 'text-red-800', icon: <MdError size={20} /> },
    warning: { bg: 'bg-yellow-100', color: 'text-yellow-800', icon: <MdWarning size={20} /> },
    info: { bg: 'bg-blue-100', color: 'text-blue-800', icon: <MdInfo size={20} /> }
  };

  const style = styles[type];

  return (
    <div className={`fixed top-20 right-5 ${style.bg} ${style.color} px-5 py-4 rounded-lg shadow-lg flex items-center gap-2.5 z-[9999] min-w-[300px] animate-[slideIn_0.3s_ease] font-semibold`}>
      {style.icon}
      <span>{message}</span>
      <button
        onClick={onClose}
        className={`ml-auto bg-transparent border-none ${style.color} cursor-pointer text-lg px-1 hover:opacity-70`}
      >
        ×
      </button>
    </div>
  );
}

export default Toast;