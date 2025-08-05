/**
 * Loading Spinner Component
 * Shows a loading indicator
 */

import React from 'react';

const AdminLoadingSpinner = () => {
  return (
    <div style={{
      padding: '60px',
      textAlign: 'center',
      color: '#666'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px auto'
      }}></div>
      Loading users...
    </div>
  );
};

export default AdminLoadingSpinner;
