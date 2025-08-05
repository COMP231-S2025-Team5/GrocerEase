/**
 * Promotion Card Component
 * Displays promotion and deal information
 */

import React from 'react';

const PromotionCard = ({ promotion, dealValidUntil, formatDate }) => {
  if (!promotion) return null;

  return (
    <div style={{
      backgroundColor: '#fff3cd',
      border: '1px solid #ffeaa7',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '25px'
    }}>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#856404',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        🏷️ Special Offer
      </h3>
      <p style={{ color: '#856404', margin: 0, fontSize: '1.1rem' }}>
        {promotion}
      </p>
      {dealValidUntil && (
        <p style={{ color: '#856404', margin: '10px 0 0 0', fontSize: '0.9rem' }}>
          <strong>Valid until:</strong> {formatDate(dealValidUntil)}
        </p>
      )}
    </div>
  );
};

export default PromotionCard;
