/**
 * Danger Zone Card Component
 * Contains dangerous actions like account deletion
 */

import React from 'react';

const DangerZoneCard = ({ onDeleteAccount }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '30px',
      marginBottom: '30px',
      border: '2px solid #dc3545'
    }}>
      <h2 style={{
        color: '#dc3545',
        marginBottom: '15px',
        fontSize: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        ⚠️ Danger Zone
      </h2>
      
      <p style={{
        color: '#666',
        marginBottom: '20px',
        fontSize: '14px'
      }}>
        Permanently delete your account and all associated data. This action cannot be undone.
      </p>
      
      <button
        onClick={onDeleteAccount}
        style={{
          padding: '12px 24px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        🗑️ Delete Account
      </button>
    </div>
  );
};

export default DangerZoneCard;
