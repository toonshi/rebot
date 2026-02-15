import React from 'react';

const Header = ({ onRun }) => {
  return (
    <header style={{
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 4,
      display: 'flex',
      gap: '10px'
    }}>
      <button 
        onClick={onRun}
        style={{
          padding: '8px 16px',
          background: '#4A90E2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Run Pipeline 🚀
      </button>
    </header>
  );
};

export default Header;