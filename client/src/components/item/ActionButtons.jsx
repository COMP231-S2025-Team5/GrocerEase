/**
 * Action Buttons Component
 * Displays action buttons for item page (back, report, add to list)
 */

import React from 'react';
import { Link } from 'react-router-dom';

const ActionButtons = ({ 
  isAuthenticated, 
  hasReported, 
  reportMessage,
  onReportClick,
  onAddToListClick 
}) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link
          to="/itemlist"
          style={{
            display: 'inline-block',
            padding: '12px 30px',
            backgroundColor: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'background-color 0.2s'
          }}
        >
          ← Back to All Items
        </Link>

        {/* Report Item Button - Only show if authenticated */}
        {isAuthenticated && (
          <button
            onClick={onReportClick}
            disabled={hasReported}
            style={{
              padding: '12px 30px',
              backgroundColor: hasReported ? '#6c757d' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: hasReported ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              opacity: hasReported ? 0.6 : 1
            }}
          >
            {hasReported ? '✓ Reported' : '🚩 Report Item'}
          </button>
        )}

        {/* Add to List Button - Only show if authenticated */}
        {isAuthenticated && (
          <button
            onClick={onAddToListClick}
            style={{
              padding: '12px 30px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              marginLeft: '15px'
            }}
          >
            📝 Add to List
          </button>
        )}
      </div>

      {/* Show message for report actions */}
      {reportMessage.text && (
        <div style={{
          marginTop: '15px',
          padding: '10px 15px',
          borderRadius: '6px',
          backgroundColor: reportMessage.type === 'success' ? '#d4edda' : 
                          reportMessage.type === 'error' ? '#f8d7da' : '#d1ecf1',
          border: `1px solid ${reportMessage.type === 'success' ? '#c3e6cb' : 
                               reportMessage.type === 'error' ? '#f5c6cb' : '#bee5eb'}`,
          color: reportMessage.type === 'success' ? '#155724' : 
                 reportMessage.type === 'error' ? '#721c24' : '#0c5460',
          maxWidth: '500px',
          margin: '15px auto'
        }}>
          {reportMessage.text}
        </div>
      )}
    </div>
  );
};

export default ActionButtons;
