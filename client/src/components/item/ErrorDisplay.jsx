/**
 * Error Display Component
 * Displays error states for the item page
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorDisplay = ({ error }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 60px)',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '8px',
        padding: '30px',
        maxWidth: '500px'
      }}>
        <h2 style={{ color: '#721c24', marginBottom: '15px' }}>
          {error === 'Item not found' ? '🔍 Item Not Found' : '❌ Error'}
        </h2>
        <p style={{ color: '#721c24', marginBottom: '20px' }}>
          {error === 'Item not found' 
            ? "Sorry, we couldn't find the item you're looking for. It may have been removed or the link might be incorrect."
            : error
          }
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/itemlist')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            Browse Items
          </button>
          <button
            onClick={() => navigate('/search')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Search Items
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
