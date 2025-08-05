/**
 * Add Item Modal Component
 * Modal for adding new items to the store
 */

import React from 'react';

const AddItemModal = ({ 
  isOpen, 
  itemData, 
  availableFilters,
  loading,
  formatCategoryName,
  onItemDataChange,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) {
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
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h3>Add New Item</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Item Name *
            </label>
            <input
              type="text"
              value={itemData.itemName}
              onChange={(e) => onItemDataChange({ ...itemData, itemName: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                color: '#333'
              }}
              placeholder="Enter item name"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Category *
            </label>
            <select
              value={itemData.category}
              onChange={(e) => onItemDataChange({ ...itemData, category: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                color: '#333'
              }}
            >
              <option value="">Select Category</option>
              {availableFilters.categories.map(cat => (
                <option key={cat} value={cat}>{formatCategoryName(cat)}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Price *
            </label>
            <input
              type="number"
              step="0.01"
              value={itemData.price}
              onChange={(e) => onItemDataChange({ ...itemData, price: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                color: '#333'
              }}
              placeholder="0.00"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Stock Count
            </label>
            <input
              type="number"
              value={itemData.stockCount}
              onChange={(e) => onItemDataChange({ ...itemData, stockCount: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                color: '#333'
              }}
              placeholder="0"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Unit
            </label>
            <select
              value={itemData.unitDetails.unit}
              onChange={(e) => onItemDataChange({ 
                ...itemData, 
                unitDetails: { ...itemData.unitDetails, unit: e.target.value }
              })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                color: '#333'
              }}
            >
              <option value="item">Item</option>
              <option value="each">Each</option>
              <option value="lb">Pound (lb)</option>
              <option value="oz">Ounce (oz)</option>
              <option value="kg">Kilogram (kg)</option>
              <option value="g">Gram (g)</option>
              <option value="pack">Pack</option>
              <option value="bottle">Bottle</option>
              <option value="can">Can</option>
              <option value="box">Box</option>
              <option value="bag">Bag</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Stock Status
            </label>
            <select
              value={itemData.stockStatus}
              onChange={(e) => onItemDataChange({ ...itemData, stockStatus: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                color: '#333'
              }}
            >
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
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
            disabled={!itemData.itemName || !itemData.category || !itemData.price || loading}
            style={{
              padding: '10px 20px',
              backgroundColor: (itemData.itemName && itemData.category && itemData.price) ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (itemData.itemName && itemData.category && itemData.price) ? 'pointer' : 'not-allowed'
            }}
          >
            {loading ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
