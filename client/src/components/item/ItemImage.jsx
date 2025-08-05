/**
 * Item Image Component
 * Displays the product image or placeholder
 */

import React from 'react';

const ItemImage = ({ itemImage, itemName }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      {itemImage?.url ? (
        <img
          src={itemImage.url}
          alt={itemImage.altText || itemName}
          style={{
            width: '100%',
            maxWidth: '400px',
            height: 'auto',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #e1e5e9'
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          maxWidth: '400px',
          height: '300px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed #dee2e6',
          color: '#6c757d'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🛒</div>
            <p>No image available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemImage;
