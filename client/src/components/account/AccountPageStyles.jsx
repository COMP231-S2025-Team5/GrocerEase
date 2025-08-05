/**
 * Account Page Styles Component
 * Contains the CSS animations for the account page
 */

import React from 'react';

const AccountPageStyles = () => {
  return (
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  );
};

export default AccountPageStyles;
