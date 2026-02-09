import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const icons = {
    success: <FaCheckCircle />,
    error: <FaTimesCircle />,
    info: <FaInfoCircle />,
  };

  const colors = {
    success: '#28a745',
    error: '#dc3545',
    info: '#17a2b8',
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        background: colors[type],
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minWidth: '250px',
        animation: 'slideIn 0.3s ease',
      }}
    >
      {icons[type]}
      <span style={{ flex: 1 }}>{message}</span>
      <FaTimes
        style={{ cursor: 'pointer', opacity: 0.7 }}
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
      />
    </div>
  );
};

export default Toast;
