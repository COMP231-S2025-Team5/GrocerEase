/**
 * Profile Card Component
 * Main profile information card with edit/display toggle
 */

import React from 'react';
import AccountMessageDisplay from './AccountMessageDisplay';
import ProfileEditForm from './ProfileEditForm';
import ProfileDisplayInfo from './ProfileDisplayInfo';

const ProfileCard = ({ 
  user,
  isEditing,
  editFormData,
  editErrors,
  editLoading,
  editMessage,
  onStartEditing,
  onInputChange,
  onSubmit,
  onCancel,
  formatDate
}) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '30px',
      marginBottom: '30px',
      border: '1px solid #e1e5e9'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{
          color: '#333',
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          margin: 0
        }}>
          👤 Profile Information
        </h2>
        
        {!isEditing && (
          <button
            onClick={onStartEditing}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {/* Message Display */}
      <AccountMessageDisplay message={editMessage} />
      
      {isEditing ? (
        <ProfileEditForm 
          editFormData={editFormData}
          editErrors={editErrors}
          editLoading={editLoading}
          onInputChange={onInputChange}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      ) : (
        <ProfileDisplayInfo 
          user={user}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

export default ProfileCard;
