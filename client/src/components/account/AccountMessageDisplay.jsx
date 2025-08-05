/**
 * Account Message Display Component
 * Shows success or error messages to the user
 */

import React from 'react';

const AccountMessageDisplay = ({ message }) => {
  if (!message.text) return null;

  return (
    <div style={{
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '20px',
      backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
      border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
      color: message.type === 'success' ? '#155724' : '#721c24'
    }}>
      {message.text}
    </div>
  );
};

export default AccountMessageDisplay;
