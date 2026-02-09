import React from 'react';

const Button = ({ title, onClick }) => {
  return (
    <button onClick={onClick} className="btn btn-primary mx-1">
      {title}
    </button>
  );
};

export default Button;