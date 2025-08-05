/**
 * Store Info Card Component
 * Displays store information for the item
 */

import React from 'react';

const StoreInfoCard = ({ store }) => {
  if (!store) return null;

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '25px'
    }}>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#333',
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        🏪 Store Information
      </h3>
      
      <div style={{ display: 'grid', gap: '8px' }}>
        <p style={{ margin: 0 }}>
          <strong>Store:</strong> {store.name}
        </p>
        {store.location && (
          <p style={{ margin: 0, color: '#666' }}>
            <strong>Location:</strong> {store.location}
          </p>
        )}
        {store.address && (
          <p style={{ margin: 0, color: '#666' }}>
            <strong>Address:</strong> {store.address}
          </p>
        )}
      </div>
    </div>
  );
};

export default StoreInfoCard;
