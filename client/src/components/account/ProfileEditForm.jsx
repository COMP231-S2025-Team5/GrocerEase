/**
 * Profile Edit Form Component
 * Form for editing user profile information
 */

import React from 'react';

const ProfileEditForm = ({ 
  editFormData, 
  editErrors, 
  editLoading, 
  onInputChange, 
  onSubmit, 
  onCancel 
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
        gap: '20px',
        marginBottom: '25px'
      }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#333'
          }}>
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={editFormData.name}
            onChange={onInputChange}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${editErrors.name ? '#dc3545' : '#e1e5e9'}`,
              borderRadius: '6px',
              fontSize: '16px',
              outline: 'none',
              backgroundColor: '#f0f8ff',
              color: '#333'
            }}
          />
          {editErrors.name && (
            <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px', margin: '4px 0 0 0' }}>
              {editErrors.name}
            </p>
          )}
        </div>
        
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#333'
          }}>
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={editFormData.email}
            onChange={onInputChange}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${editErrors.email ? '#dc3545' : '#e1e5e9'}`,
              borderRadius: '6px',
              fontSize: '16px',
              outline: 'none',
              backgroundColor: '#f0f8ff',
              color: '#333'
            }}
          />
          {editErrors.email && (
            <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px', margin: '4px 0 0 0' }}>
              {editErrors.email}
            </p>
          )}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={editLoading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: editLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            opacity: editLoading ? 0.6 : 1
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={editLoading}
          style={{
            padding: '12px 24px',
            backgroundColor: editLoading ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: editLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {editLoading && (
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
          {editLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
