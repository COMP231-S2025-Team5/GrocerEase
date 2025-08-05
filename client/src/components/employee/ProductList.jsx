/**
 * Product List Component
 * Displays the list of products with header and controls
 */

import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ 
  products, 
  loading, 
  pagination,
  storeInfo,
  formatCategoryName,
  getStatusBadge,
  onAddItem,
  onQuickOutOfStock,
  onSelectProduct,
  onEditItem,
  onRemoveItem
}) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '10px'
        }}>
          <h3 style={{ 
            color: '#333', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            fontSize: '1.4rem',
            margin: 0
          }}>
            🛒 Store Inventory
            <span style={{ 
              fontSize: '1rem', 
              color: '#666', 
              fontWeight: 'normal' 
            }}>
              ({pagination.totalItems} products{storeInfo?.name ? ` at ${storeInfo.name}` : ''})
            </span>
          </h3>
          
          <button
            onClick={onAddItem}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ➕ Add New Item
          </button>
        </div>
        {storeInfo && (
          <p style={{ 
            color: '#666', 
            fontSize: '14px', 
            margin: '5px 0 0 0',
            fontStyle: 'italic'
          }}>
            You can only view and manage products from your assigned store: <strong>{storeInfo.name}</strong>
          </p>
        )}
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {products.map(product => (
          <ProductCard
            key={product._id}
            product={product}
            loading={loading}
            formatCategoryName={formatCategoryName}
            getStatusBadge={getStatusBadge}
            onQuickOutOfStock={onQuickOutOfStock}
            onSelectProduct={onSelectProduct}
            onEditItem={onEditItem}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>
    </>
  );
};

export default ProductList;
