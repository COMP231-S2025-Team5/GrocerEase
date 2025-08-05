/**
 * Security Settings Card Component
 * Contains security-related actions like password change
 */

import React from 'react';

const SecuritySettingsCard = ({ onPasswordChange }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '30px',
      marginBottom: '30px',
      border: '1px solid #e1e5e9'
    }}>
      <h2 style={{
        color: '#333',
        marginBottom: '20px',
        fontSize: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        🔒 Security Settings
      </h2>
      
      <div style={{
        display: 'flex',
        flexDirection: window.innerWidth > 768 ? 'row' : 'column',
        gap: '15px'
      }}>
        <button
          onClick={onPasswordChange}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'center'
          }}
        >
          🔑 Change Password
        </button>
      </div>
    </div>
  );
};

export default SecuritySettingsCard;
