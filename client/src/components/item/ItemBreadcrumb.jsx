/**
 * Item Breadcrumb Component
 * Navigation breadcrumb for item pages
 */

import React from 'react';
import { Link } from 'react-router-dom';

const ItemBreadcrumb = ({ itemName }) => {
  return (
    <nav style={{
      marginBottom: '30px',
      fontSize: '14px',
      color: '#666'
    }}>
      <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>Home</Link>
      <span style={{ margin: '0 8px' }}>›</span>
      <Link to="/itemlist" style={{ color: '#007bff', textDecoration: 'none' }}>Items</Link>
      <span style={{ margin: '0 8px' }}>›</span>
      <span>{itemName}</span>
    </nav>
  );
};

export default ItemBreadcrumb;
