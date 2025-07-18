import React from 'react';

const Homepage = () => {
  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 60px)', // Subtract navigation height
      width: '100%',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <h1>Homepage</h1>
    </div>
  );
};

export default Homepage;
