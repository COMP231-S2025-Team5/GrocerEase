/**
 * Product Filters Component
 * Search and filtering controls for the employee dashboard
 */

import React from 'react';

const ProductFilters = ({ filters, availableFilters, onFilterChange, formatCategoryName }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '25px',
      marginBottom: '25px',
      border: '1px solid #e1e5e9'
    }}>
      <h3 style={{
        color: '#333',
        marginBottom: '20px',
        fontSize: '1.3rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        Search & Filter Products
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        alignItems: 'end'
      }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#333',
            fontSize: '14px'
          }}>
            Search Products
          </label>
          <input
            type="text"
            value={filters.q}
            onChange={(e) => onFilterChange('q', e.target.value)}
            placeholder="Search by product name..."
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px',
              transition: 'border-color 0.2s',
              outline: 'none',
              backgroundColor: 'white',
              color: '#333'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#333',
            fontSize: '14px'
          }}>
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              color: '#333',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Categories</option>
            {availableFilters.categories.map(cat => (
              <option key={cat} value={cat} style={{ color: '#333', backgroundColor: 'white' }}>
                {formatCategoryName(cat)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#333',
            fontSize: '14px'
          }}>
            Stock Status
          </label>
          <select
            value={filters.stockStatus}
            onChange={(e) => onFilterChange('stockStatus', e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              color: '#333',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Status</option>
            {availableFilters.stockStatuses.map(status => (
              <option key={status} value={status} style={{ color: '#333', backgroundColor: 'white' }}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#333',
            fontSize: '14px'
          }}>
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              color: '#333',
              cursor: 'pointer'
            }}
          >
            <option value="itemName" style={{ color: '#333', backgroundColor: 'white' }}>📝 Name</option>
            <option value="category" style={{ color: '#333', backgroundColor: 'white' }}>📂 Category</option>
            <option value="price" style={{ color: '#333', backgroundColor: 'white' }}>💰 Price</option>
            <option value="stockStatus" style={{ color: '#333', backgroundColor: 'white' }}>📊 Stock Status</option>
          </select>
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#333',
            fontSize: '14px'
          }}>
            Order
          </label>
          <select
            value={filters.sortOrder}
            onChange={(e) => onFilterChange('sortOrder', e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              color: '#333',
              cursor: 'pointer'
            }}
          >
            <option value="asc" style={{ color: '#333', backgroundColor: 'white' }}>⬆️ Ascending</option>
            <option value="desc" style={{ color: '#333', backgroundColor: 'white' }}>⬇️ Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
