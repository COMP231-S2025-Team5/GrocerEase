/**
 * Profile Display Info Component
 * Read-only display of user profile information
 */

import React from 'react';

const ProfileDisplayInfo = ({ user, formatDate }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
      gap: '20px',
      color: '#333'
    }}>
      <div>
        <strong>Full Name:</strong>
        <p style={{ margin: '5px 0', color: '#666' }}>{user.name}</p>
      </div>
      <div>
        <strong>Email Address:</strong>
        <p style={{ margin: '5px 0', color: '#666' }}>{user.email}</p>
      </div>
      <div>
        <strong>Account Type:</strong>
        <p style={{ margin: '5px 0', color: '#666', textTransform: 'capitalize' }}>
          {user.role} Account
        </p>
      </div>
      <div>
        <strong>Member Since:</strong>
        <p style={{ margin: '5px 0', color: '#666' }}>
          {formatDate(user.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default ProfileDisplayInfo;
