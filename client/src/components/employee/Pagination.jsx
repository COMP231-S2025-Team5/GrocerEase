/**
 * Pagination Component
 * Handles pagination controls for the product list
 */

import React from 'react';

const Pagination = ({ pagination, onPageChange }) => {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {pagination.hasPrevPage && (
        <button
          onClick={() => onPageChange(pagination.currentPage - 1)}
          style={{
            margin: '0 5px',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Previous
        </button>
      )}
      
      <span style={{ margin: '0 15px' }}>
        Page {pagination.currentPage} of {pagination.totalPages}
      </span>

      {pagination.hasNextPage && (
        <button
          onClick={() => onPageChange(pagination.currentPage + 1)}
          style={{
            margin: '0 5px',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;
