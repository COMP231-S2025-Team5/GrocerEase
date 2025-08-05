/**
 * Action Buttons Component
 * Edit, Reset Password, and Delete buttons for user management
 */

import React from 'react';

const ActionButtons = ({ 
  user, 
  onEdit, 
  onResetPassword, 
  onDelete 
}) => {
  const isAdmin = user.role === 'admin';

  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
      <button
        onClick={() => onEdit(user)}
        disabled={isAdmin}
        style={{
          padding: '6px 12px',
          backgroundColor: isAdmin ? '#6c757d' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isAdmin ? 'not-allowed' : 'pointer',
          fontSize: '12px',
          fontWeight: '500',
          transition: 'background-color 0.2s',
          opacity: isAdmin ? 0.6 : 1
        }}
        onMouseOver={(e) => {
          if (!isAdmin) {
            e.target.style.backgroundColor = '#218838';
          }
        }}
        onMouseOut={(e) => {
          if (!isAdmin) {
            e.target.style.backgroundColor = '#28a745';
          }
        }}
      >
        Edit
      </button>
      <button
        onClick={() => onResetPassword(user._id, user.name)}
        disabled={isAdmin}
        style={{
          padding: '6px 12px',
          backgroundColor: isAdmin ? '#6c757d' : '#ffc107',
          color: isAdmin ? 'white' : '#212529',
          border: 'none',
          borderRadius: '4px',
          cursor: isAdmin ? 'not-allowed' : 'pointer',
          fontSize: '12px',
          fontWeight: '500',
          transition: 'background-color 0.2s',
          opacity: isAdmin ? 0.6 : 1
        }}
        onMouseOver={(e) => {
          if (!isAdmin) {
            e.target.style.backgroundColor = '#e0a800';
          }
        }}
        onMouseOut={(e) => {
          if (!isAdmin) {
            e.target.style.backgroundColor = '#ffc107';
          }
        }}
      >
        Reset
      </button>
      <button
        onClick={() => onDelete(user._id, user.name)}
        disabled={isAdmin}
        style={{
          padding: '6px 12px',
          backgroundColor: isAdmin ? '#6c757d' : '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isAdmin ? 'not-allowed' : 'pointer',
          fontSize: '12px',
          fontWeight: '500',
          transition: 'background-color 0.2s',
          opacity: isAdmin ? 0.6 : 1
        }}
        onMouseOver={(e) => {
          if (!isAdmin) {
            e.target.style.backgroundColor = '#c82333';
          }
        }}
        onMouseOut={(e) => {
          if (!isAdmin) {
            e.target.style.backgroundColor = '#dc3545';
          }
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default ActionButtons;
