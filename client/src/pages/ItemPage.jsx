import React from 'react';
import { useParams } from 'react-router-dom';

const ItemPage = () => {
  const { id } = useParams();
  
  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 60px)', // Subtract navigation height
      width: '100%',
      padding: '20px',
      boxSizing: 'border-box',
      flexDirection: 'column'
    }}>
      <h1>View Item Page</h1>
      <p>Item ID: {id}</p>
    </div>
  );
};

export default ItemPage;
