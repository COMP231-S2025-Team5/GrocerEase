/**
 * Admin Page Styles Component
 * Contains the CSS animations for the admin page
 */

import React from 'react';

const AdminPageStyles = () => {
  return (
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  );
};

export default AdminPageStyles;
