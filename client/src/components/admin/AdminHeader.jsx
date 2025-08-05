/**
 * Admin Header Component
 * Displays the admin dashboard title and description
 */

import React from 'react';

const AdminHeader = () => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '30px',
      marginBottom: '30px',
      border: '1px solid #e1e5e9'
    }}>
      <h1 style={{
        color: '#333',
        marginBottom: '10px',
        fontSize: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        🛡️ Admin Dashboard
      </h1>
      <p style={{
        color: '#666',
        fontSize: '1.1rem',
        margin: 0
      }}>
        Manage user accounts, roles, and permissions
      </p>
    </div>
  );
};

export default AdminHeader;
