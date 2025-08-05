/**
 * Loading Guard Component
 * Shows login prompt when user is not authenticated
 */

import React from 'react';
import { Link } from 'react-router-dom';

const LoadingGuard = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 60px)',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h2>Please log in to access your account</h2>
      <Link 
        to="/login"
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px'
        }}
      >
        Go to Login
      </Link>
    </div>
  );
};

export default LoadingGuard;
