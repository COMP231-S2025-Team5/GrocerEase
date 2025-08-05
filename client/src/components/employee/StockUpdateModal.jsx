/**
 * Stock Update Modal Component
 * Modal for updating stock status and count
 */

import React from 'react';

const StockUpdateModal = ({ 
  isOpen, 
  selectedProduct, 
  updateData, 
  loading,
  getStatusBadge,
  onUpdateData,
  onConfirm,
  onCancel
}) => {
  if (!isOpen || !selectedProduct) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h3>Update Stock Status</h3>
        <p><strong>Product:</strong> {selectedProduct.itemName}</p>
        <p><strong>Current Status:</strong> {getStatusBadge(selectedProduct.stockStatus)}</p>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            New Stock Status *
          </label>
          <select
            value={updateData.stockStatus}
            onChange={(e) => onUpdateData({ ...updateData, stockStatus: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'white',
              color: '#333',
              fontSize: '14px'
            }}
          >
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="discontinued">Discontinued</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Stock Count
          </label>
          <input
            type="number"
            value={updateData.stockCount}
            onChange={(e) => onUpdateData({ ...updateData, stockCount: e.target.value })}
            min="0"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'white',
              color: '#333',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Reason for Change
          </label>
          <textarea
            value={updateData.reason}
            onChange={(e) => onUpdateData({ ...updateData, reason: e.target.value })}
            rows="3"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'white',
              color: '#333',
              fontSize: '14px',
              resize: 'vertical'
            }}
            placeholder="Optional reason for the stock status change..."
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          
          <button
            onClick={onConfirm}
            disabled={!updateData.stockStatus || loading}
            style={{
              padding: '10px 20px',
              backgroundColor: updateData.stockStatus ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: updateData.stockStatus ? 'pointer' : 'not-allowed'
            }}
          >
            {loading ? 'Updating...' : 'Update Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockUpdateModal;
