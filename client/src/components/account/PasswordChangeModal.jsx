/**
 * Password Change Modal Component
 * Modal for changing user password
 */

import React from 'react';
import AccountMessageDisplay from './AccountMessageDisplay';

const PasswordChangeModal = ({ 
  isOpen,
  passwordFormData,
  passwordErrors,
  passwordLoading,
  passwordMessage,
  onInputChange,
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
          color: '#333',
          marginBottom: '20px',
          fontSize: '1.3rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          🔒 Change Password
        </h3>

        <AccountMessageDisplay message={passwordMessage} />

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              Current Password *
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordFormData.currentPassword}
              onChange={onInputChange}
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${passwordErrors.currentPassword ? '#dc3545' : '#e1e5e9'}`,
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: '#f0f8ff',
                color: '#333'
              }}
            />
            {passwordErrors.currentPassword && (
              <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px', margin: '4px 0 0 0' }}>
                {passwordErrors.currentPassword}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              New Password *
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordFormData.newPassword}
              onChange={onInputChange}
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${passwordErrors.newPassword ? '#dc3545' : '#e1e5e9'}`,
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: '#f0f8ff',
                color: '#333'
              }}
            />
            {passwordErrors.newPassword && (
              <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px' }}>
                {passwordErrors.newPassword}
              </p>
            )}
            <p style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
              Must contain at least 6 characters with uppercase, lowercase, and number
            </p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              Confirm New Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordFormData.confirmPassword}
              onChange={onInputChange}
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${passwordErrors.confirmPassword ? '#dc3545' : '#e1e5e9'}`,
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: '#f0f8ff',
                color: '#333'
              }}
            />
            {passwordErrors.confirmPassword && (
              <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px', margin: '4px 0 0 0' }}>
                {passwordErrors.confirmPassword}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={passwordLoading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: passwordLoading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                opacity: passwordLoading ? 0.6 : 1
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={passwordLoading}
              style={{
                padding: '12px 24px',
                backgroundColor: passwordLoading ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: passwordLoading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {passwordLoading && (
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
              {passwordLoading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
