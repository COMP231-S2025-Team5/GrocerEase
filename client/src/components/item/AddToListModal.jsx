/**
 * Add to List Modal Component
 * Modal for adding items to grocery lists
 */

import React from 'react';

const AddToListModal = ({ 
  isOpen,
  item,
  userLists,
  selectedListId,
  addToListMessage,
  addToListLoading,
  onListSelect,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        border: '1px solid #e1e5e9'
      }}>
        <h3 style={{
          color: '#333',
          marginBottom: '20px',
          fontSize: '1.3rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          📝 Add to Grocery List
        </h3>

        {addToListMessage.text && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
            backgroundColor: addToListMessage.type === 'success' ? '#d4edda' : '#f8d7da',
            border: `1px solid ${addToListMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            color: addToListMessage.type === 'success' ? '#155724' : '#721c24'
          }}>
            {addToListMessage.text}
          </div>
        )}

        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #e1e5e9',
          borderRadius: '6px',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            {item?.itemImage?.url ? (
              <img 
                src={item.itemImage.url} 
                alt={item.itemImage.altText || item?.itemName}
                style={{
                  width: '50px',
                  height: '50px',
                  objectFit: 'cover',
                  borderRadius: '6px'
                }}
              />
            ) : (
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#f8f9fa',
                border: '2px dashed #dee2e6',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: '#6c757d'
              }}>
                📦
              </div>
            )}
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: '#333' }}>{item?.itemName}</h4>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                ${item?.price} at {item?.store?.name || 'Store not specified'}
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#333'
          }}>
            Select Grocery List:
          </label>
          <select
            value={selectedListId}
            onChange={(e) => onListSelect(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '6px',
              fontSize: '16px',
              outline: 'none',
              backgroundColor: '#f0f8ff',
              color: '#333'
            }}
          >
            <option value="">Choose a list...</option>
            {userLists.map(list => (
              <option key={list._id} value={list._id}>
                {list.listName} ({list.items?.length || 0} items)
              </option>
            ))}
          </select>
          
          {userLists.length === 0 && (
            <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
              No grocery lists found. <a href="/groceryListOverview" style={{ color: '#007bff' }}>Create one first</a>
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={addToListLoading}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: addToListLoading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              opacity: addToListLoading ? 0.6 : 1
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={addToListLoading || !selectedListId}
            style={{
              padding: '12px 24px',
              backgroundColor: (addToListLoading || !selectedListId) ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: (addToListLoading || !selectedListId) ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {addToListLoading && (
              <span style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: '2px solid #ffffff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></span>
            )}
            {addToListLoading ? 'Adding...' : 'Add to List'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToListModal;
