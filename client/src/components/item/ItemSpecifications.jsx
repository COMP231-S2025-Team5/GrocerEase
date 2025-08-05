/**
 * Item Specifications Component
 * Displays detailed item specifications and information
 */

import React from 'react';

const ItemSpecifications = ({ item, formatCategoryName, formatPrice, formatDate }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '25px',
      marginTop: '40px',
      border: '1px solid #dee2e6'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#333',
        marginBottom: '20px'
      }}>
        📋 Item Details
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
        gap: '15px',
        color: '#333'
      }}>
        <div>
          <strong>Item Name:</strong> {item.itemName}
        </div>
        <div>
          <strong>Category:</strong> {formatCategoryName(item.category) || 'Not specified'}
        </div>
        <div>
          <strong>Current Price:</strong> {formatPrice(item.price)}
        </div>
        {item.originalPrice && (
          <div>
            <strong>Original Price:</strong> {formatPrice(item.originalPrice)}
          </div>
        )}
        {item.unitDetails && (
          <>
            <div>
              <strong>Quantity:</strong> {item.unitDetails.quantity} {item.unitDetails.unit || 'item'}
            </div>
            {item.unitDetails.pricePerUnit && (
              <div>
                <strong>Price per Unit:</strong> {formatPrice(item.unitDetails.pricePerUnit)}
              </div>
            )}
          </>
        )}
        <div>
          <strong>Store:</strong> {item.store?.name || 'Not specified'}
        </div>
        {item.store?.location && (
          <div>
            <strong>Store Location:</strong> {item.store.location}
          </div>
        )}
        {item.promotion && (
          <div style={{ gridColumn: window.innerWidth > 768 ? '1 / -1' : 'auto' }}>
            <strong>Promotion:</strong> {item.promotion}
          </div>
        )}
        {item.dealValidUntil && (
          <div>
            <strong>Deal Valid Until:</strong> {formatDate(item.dealValidUntil)}
          </div>
        )}
        <div>
          <strong>Last Updated:</strong> {formatDate(item.updatedAt)}
        </div>
      </div>
    </div>
  );
};

export default ItemSpecifications;
