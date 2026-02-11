import React from 'react';

const Button = ({ title, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className="btn btn-primary mx-1"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        border: 'none',
        padding: '0.5rem 1.2rem',
        borderRadius: '25px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      {title}
    </button>
  );
};

export default Button;