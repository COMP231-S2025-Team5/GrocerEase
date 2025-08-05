/**
 * Message Display Component
 * Shows success or error messages to the user
 */

import React from 'react';

const MessageDisplay = ({ message }) => {
  if (!message.text) return null;

  return (
    <div style={{
      backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
      color: message.type === 'success' ? '#155724' : '#721c24',
      border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '20px',
      fontSize: '14px',
      fontWeight: '500'
    }}>
      {message.text}
    </div>
  );
};

export default MessageDisplay;
