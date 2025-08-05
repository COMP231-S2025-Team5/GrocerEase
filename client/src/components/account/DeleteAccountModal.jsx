/**
 * Delete Account Modal Component
 * Modal for confirming account deletion
 */

import React from 'react';
import AccountMessageDisplay from './AccountMessageDisplay';

const DeleteAccountModal = ({ 
  isOpen,
  deleteConfirmation,
  deleteLoading,
  deleteMessage,
  onConfirmationChange,
  onSubmit,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        border: '1px solid #e1e5e9'
      }}>
        <h3 style={{
          color: '#dc3545',
          marginBottom: '20px',
          fontSize: '1.3rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          ⚠️ Delete Account
        </h3>

        <AccountMessageDisplay message={deleteMessage} />

        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '6px',
          padding: '16px',
          marginBottom: '20px',
          color: '#856404'
        }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: '600' }}>
            ⚠️ Warning: This action cannot be undone!
          </p>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Deleting your account will permanently remove all your data, including your profile information and any reports you've submitted. This action is irreversible.
          </p>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#333'
          }}>
            Type "DELETE" to confirm account deletion:
          </label>
          <input
            type="text"
            value={deleteConfirmation}
            onChange={onConfirmationChange}
            placeholder="Type DELETE to confirm"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '6px',
              fontSize: '16px',
              outline: 'none',
              backgroundColor: '#f0f8ff',
              color: '#333'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={deleteLoading}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: deleteLoading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              opacity: deleteLoading ? 0.6 : 1
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={deleteLoading || deleteConfirmation !== 'DELETE'}
            style={{
              padding: '12px 24px',
              backgroundColor: (deleteLoading || deleteConfirmation !== 'DELETE') ? '#6c757d' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: (deleteLoading || deleteConfirmation !== 'DELETE') ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {deleteLoading && (
              <span style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: '2px solid #ffffff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></span>
            )}
            {deleteLoading ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
