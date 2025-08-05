/**
 * Pagination Component
 * Provides pagination controls for the users table
 */

import React from 'react';

const Pagination = ({ 
  page, 
  totalPages, 
  total, 
  limit, 
  onPageChange 
}) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{
      padding: '20px 25px',
      borderTop: '1px solid #e1e5e9',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ color: '#666', fontSize: '14px' }}>
        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} users
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          style={{
            padding: '8px 12px',
            backgroundColor: page === 1 ? '#e9ecef' : '#007bff',
            color: page === 1 ? '#6c757d' : 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: page === 1 ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          ← Previous
        </button>
        <span style={{
          padding: '8px 12px',
          backgroundColor: '#e9ecef',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          style={{
            padding: '8px 12px',
            backgroundColor: page === totalPages ? '#e9ecef' : '#007bff',
            color: page === totalPages ? '#6c757d' : 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: page === totalPages ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
