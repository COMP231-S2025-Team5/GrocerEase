/**
 * Item Details Component
 * Displays main item information including title, category, and pricing
 */

import React from 'react';

const ItemDetails = ({ item, formatCategoryName, formatPrice, calculateSavings }) => {
  const savings = calculateSavings(item.originalPrice, item.price);
  const isOnSale = savings !== null;

  return (
    <div>
      {/* Title and Category */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '10px',
          lineHeight: '1.2'
        }}>
          {item.itemName}
        </h1>
        
        {item.category && (
          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            backgroundColor: '#e7f3ff',
            color: '#0066cc',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            {formatCategoryName(item.category)}
          </span>
        )}
      </div>

      {/* Pricing Section */}
      <div style={{
        backgroundColor: isOnSale ? '#f8f9fa' : 'white',
        border: isOnSale ? '2px solid #28a745' : '1px solid #dee2e6',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '25px'
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px', marginBottom: '10px' }}>
          <span style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: isOnSale ? '#28a745' : '#333'
          }}>
            {formatPrice(item.price)}
          </span>
          
          {isOnSale && (
            <span style={{
              fontSize: '1.5rem',
              textDecoration: 'line-through',
              color: '#999'
            }}>
              {formatPrice(item.originalPrice)}
            </span>
          )}
        </div>

        {savings && (
          <div style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.95rem',
            fontWeight: '600'
          }}>
            💰 Save {formatPrice(savings.amount)} ({savings.percentage}% off!)
          </div>
        )}

        {item.unitDetails && (
          <div style={{ marginTop: '15px' }}>
            <p style={{ color: '#666', fontSize: '0.95rem', margin: '5px 0' }}>
              <strong>Unit:</strong> {item.unitDetails.quantity} {item.unitDetails.unit || 'item'}
            </p>
            {item.unitDetails.pricePerUnit && (
              <p style={{ color: '#666', fontSize: '0.95rem', margin: '5px 0' }}>
                <strong>Price per {item.unitDetails.unit || 'item'}:</strong> {formatPrice(item.unitDetails.pricePerUnit)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetails;
