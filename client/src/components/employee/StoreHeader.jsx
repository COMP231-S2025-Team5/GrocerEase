/**
 * Store Header Component
 * Displays store information and welcome message for employees
 */

import React from 'react';

const StoreHeader = ({ user, storeInfo, totalItems }) => {
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
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 style={{
            color: '#333',
            marginBottom: '10px',
            fontSize: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            👷 Employee Dashboard
          </h1>
          <p style={{
            color: '#666',
            fontSize: '1.1rem',
            margin: '0 0 10px 0'
          }}>
            Welcome back, <strong>{user.name}</strong>!
          </p>
          {user.employeeDetails && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#e3f2fd',
              padding: '10px 15px',
              borderRadius: '8px',
              border: '1px solid #bbdefb'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🏪</span>
              <div>
                <strong style={{ color: '#1976d2' }}>
                  {storeInfo?.name || user.employeeDetails?.storeName || 'Store Name'}
                </strong>
                <span style={{ color: '#666', marginLeft: '10px' }}>
                  📍 {storeInfo?.location || user.employeeDetails?.storeLocation || 'Location'}
                </span>
                {storeInfo && (
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                    Showing products from your assigned store only
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Quick Stats */}
        <div style={{
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            backgroundColor: '#e8f5e8',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center',
            minWidth: '120px',
            border: '1px solid #c8e6c9'
          }}>
            <div style={{ fontSize: '1.5rem', color: '#2e7d32' }}>📦</div>
            <div style={{ fontWeight: 'bold', color: '#2e7d32' }}>{totalItems}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Total Products</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreHeader;
