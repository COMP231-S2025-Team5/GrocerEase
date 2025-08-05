/**
 * Product Card Component
 * Individual product item display with action buttons
 */

import React from 'react';

const ProductCard = ({ 
  product, 
  loading, 
  formatCategoryName, 
  getStatusBadge,
  onQuickOutOfStock,
  onSelectProduct,
  onEditItem,
  onRemoveItem
}) => {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      backgroundColor: 'white'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 10px 0' }}>{product.itemName}</h4>
          <p style={{ margin: '5px 0', color: '#666' }}>
            <strong>Price:</strong> ${product.price.toFixed(2)}
            {product.unitDetails && ` per ${product.unitDetails.unit}`}
          </p>
          <p style={{ margin: '5px 0', color: '#666' }}>
            <strong>Category:</strong> {formatCategoryName(product.category)}
          </p>
          <p style={{ margin: '5px 0', color: '#666' }}>
            <strong>Stock Count:</strong> {product.stockCount || 0}
          </p>
          <div style={{ margin: '10px 0' }}>
            <strong>Status: </strong>
            {getStatusBadge(product.stockStatus)}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '200px' }}>
          {/* Quick Out of Stock Button */}
          {product.stockStatus !== 'out-of-stock' && (
            <button
              onClick={() => onQuickOutOfStock(product)}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              disabled={loading}
            >
              Mark Out of Stock
            </button>
          )}

          {/* Update Stock Button */}
          <button
            onClick={() => onSelectProduct(product)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Update Stock
          </button>

          {/* Edit Item Button */}
          <button
            onClick={() => onEditItem(product)}
            style={{
              backgroundColor: '#ffc107',
              color: '#212529',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Edit Item
          </button>

          {/* Remove Item Button */}
          <button
            onClick={() => onRemoveItem(product)}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            disabled={loading}
          >
            Remove
          </button>
        </div>
      </div>

      {product.lastStockUpdate && (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#666'
        }}>
          <strong>Last Updated:</strong> {new Date(product.lastStockUpdate.updatedAt).toLocaleString()} 
          by {product.lastStockUpdate.employeeName}
          {product.lastStockUpdate.reason && (
            <><br /><strong>Reason:</strong> {product.lastStockUpdate.reason}</>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
