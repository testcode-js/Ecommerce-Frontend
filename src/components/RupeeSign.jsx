import React from 'react';

const RupeeSign = ({ className, style }) => {
  return (
    <svg 
      className={className}
      style={style}
      width="1em" 
      height="1em" 
      viewBox="0 0 24 24" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.5h-2v-2h2v2zm0-4.5h-2c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h2V7h-2V5h2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2h-2v2zm0-4v-2h2v2h-2z"/>
    </svg>
  );
};

export default RupeeSign;
