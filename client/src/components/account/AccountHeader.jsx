/**
 * Account Header Component
 * Displays the account page title and breadcrumb navigation
 */

import React from 'react';
import { Link } from 'react-router-dom';

const AccountHeader = () => {
  return (
    <>
      {/* Header */}
      <div style={{
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: '#333',
          marginBottom: '10px',
          fontSize: '2.5rem'
        }}>
          Account Settings ⚙️
        </h1>
        <p style={{ color: '#666' }}>
          Manage your profile information and account preferences
        </p>
      </div>

      {/* Breadcrumb */}
      <div style={{
        marginBottom: '20px',
        fontSize: '14px',
        color: '#666'
      }}>
        <Link to="/dashboard" style={{ color: '#007bff', textDecoration: 'none' }}>
          Dashboard
        </Link>
        {' > '}
        <span>Account Settings</span>
      </div>
    </>
  );
};

export default AccountHeader;
