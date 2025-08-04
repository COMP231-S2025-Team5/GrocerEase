import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const GroceryListPage = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [listName, setListName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // or 'desc'

  useEffect(() => {
    const fetchListData = async () => {
      try {
        const token = localStorage.getItem('grocerease_token');
        
        // Fetch the complete list details (includes name and items)
        const res = await fetch(`/api/grocery-lists/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch list');
        }
        
        const data = await res.json();
        if (data.success) {
          setListName(data.list.listName);
          console.log('Grocery list data:', data.list.items); // Debug log
          setItems(data.list.items);
        } else {
          throw new Error(data.message);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching list data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchListData();
  }, [id]);

  const handleRemove = async (itemId) => {
    try {
      const token = localStorage.getItem('grocerease_token');
      const res = await fetch(`/api/grocery-lists/${id}/remove-item/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete item');
      }
      
      setItems(prev => prev.filter(i => (i.item?._id || i.item) !== itemId));
    } catch (err) {
      alert('Error removing item: ' + err.message);
    }
  };


  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem('grocerease_token');
      const res = await fetch(`/api/grocery-lists/${id}/update-quantity`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      });

      if (!res.ok) throw new Error('Failed to update quantity');

      const updated = await res.json();

      // Update local state
      setItems(prev =>
        prev.map(i =>
          (i.item?._id || i.item) === itemId ? { ...i, quantity: newQuantity } : i
        )
      );
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Could not update quantity.');
    }
  };

  const getSortedItems = () => {
    if (!sortField) return items;

    return [...items].sort((a, b) => {
      const valA = a.item[sortField];
      const valB = b.item[sortField];

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      return 0; // fallback for unsupported types
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };


  if (loading) return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 60px)',
      padding: '20px'
    }}>
      <h2 style={{ color: '#666', marginBottom: '10px' }}>Loading your list...</h2>
    </div>
  );
  
  if (error) return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 60px)',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h2 style={{ color: '#dc3545', marginBottom: '10px' }}>Error Loading List</h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>{error}</p>
    </div>
  );

  const formatPrice = (price) => {
    if (typeof price !== 'number') return '—';
    return `$${price.toFixed(2)}`;
  };

  const headerStyle = {
    padding: '12px 8px',
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
    fontWeight: '600',
    color: '#495057',
    textAlign: 'left'
  };

  const cellStyle = {
    padding: '12px 8px',
    verticalAlign: 'middle'
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%'
    }}>
      {/* Back to Lists Navigation */}
      <div style={{ marginBottom: '20px' }}>
        <Link 
          to="/groceryListOverview" 
          style={{ 
            color: '#007bff', 
            textDecoration: 'none',
            fontSize: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← Back to My Lists
        </Link>
      </div>
      
      <div style={{
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: '#333',
          marginBottom: '10px',
          fontSize: '2rem'
        }}>
          {listName || 'My Grocery List'}
        </h1>
        <p style={{ color: '#666' }}>
          {items.length === 0 ? 'Your list is empty' : `${items.length} item${items.length !== 1 ? 's' : ''} in your list`}
        </p>
      </div>

      {items.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          margin: '40px 0'
        }}>
          <h3 style={{ color: '#666', marginBottom: '15px' }}>No items in this list yet</h3>
          <p style={{ color: '#999', marginBottom: '20px' }}>
            Start adding items to build your grocery list!
          </p>
          <Link
            to="/itemlist"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '600'
            }}
          >
            Browse Items
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div style={{ 
            display: window.innerWidth > 768 ? 'block' : 'none',
            overflowX: 'auto',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid #eee'
          }}>
            <table style={{ 
              borderCollapse: 'collapse', 
              width: '100%',
              fontSize: '0.9rem'
            }}>
              <thead>
                <tr>
                  <th style={headerStyle}>Item</th>
                  <th style={headerStyle}>Price</th>
                  <th style={headerStyle}>Original Price</th>
                  <th style={headerStyle}>Store</th>
                  <th style={headerStyle}>Unit</th>
                  <th style={headerStyle}>Category</th>
                  <th style={headerStyle}>Promotion</th>
                  <th style={headerStyle}>Deal Ends</th>
                  <th style={headerStyle}>Quantity</th>
                  <th style={headerStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getSortedItems().map((listItem, idx) => {
                  console.log('Processing list item:', listItem); // Debug log
                  console.log('List item price:', listItem.price); // Debug price
                  console.log('List item store:', listItem.store); // Debug store
                  console.log('Populated item:', listItem.item); // Debug populated item
                  const { item, quantity } = listItem;
                  return (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={cellStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {item?.itemImage?.url ? (
                          <img
                            src={item.itemImage.url}
                            alt={item.itemImage.altText || listItem.itemName}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '4px',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '4px',
                            backgroundColor: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px'
                          }}>
                            📦
                          </div>
                        )}
                        <span style={{
                          color: '#333',
                          fontWeight: '500'
                        }}>
                          {listItem.itemName || item?.itemName || 'Unknown Item'}
                        </span>
                      </div>
                    </td>
                    <td style={cellStyle}>
                      <span style={{
                        fontWeight: 'bold',
                        color: item?.originalPrice && (listItem.price || item?.price) < item?.originalPrice ? '#28a745' : '#333'
                      }}>
                        {formatPrice(listItem.price || item?.price) || '—'}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      {item?.originalPrice && item?.originalPrice !== listItem.price ? (
                        <span style={{
                          textDecoration: 'line-through',
                          color: '#999'
                        }}>
                          {formatPrice(item?.originalPrice)}
                        </span>
                      ) : '—'}
                    </td>
                    <td style={cellStyle}>
                      {typeof listItem.store === 'string' ? listItem.store : (listItem.store?.name || '—')}
                    </td>
                    <td style={cellStyle}>
                      {item?.unitDetails?.quantity} {item?.unitDetails?.unit || 'item'}
                    </td>
                    <td style={cellStyle}>
                      <span style={{
                        padding: '2px 8px',
                        backgroundColor: '#e9ecef',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        textTransform: 'capitalize'
                      }}>
                        {item?.category || 'other'}
                      </span>
                    </td>
                    <td style={cellStyle}>{item?.promotion || '—'}</td>
                    <td style={cellStyle}>
                      {item?.dealValidUntil ? new Date(item.dealValidUntil).toLocaleDateString() : '—'}
                    </td>
                    <td style={cellStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button 
                          onClick={() => handleUpdateQuantity(item?._id, quantity - 1)} 
                          disabled={quantity <= 1}
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            border: '1px solid #ddd',
                            backgroundColor: quantity <= 1 ? '#f8f9fa' : 'white',
                            color: quantity <= 1 ? '#ccc' : '#666',
                            cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px'
                          }}
                        >
                          −
                        </button>
                        <span style={{ 
                          minWidth: '30px', 
                          textAlign: 'center',
                          fontWeight: '600'
                        }}>
                          {quantity}
                        </span>
                        <button 
                          onClick={() => handleUpdateQuantity(item?._id, quantity + 1)}
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            border: '1px solid #ddd',
                            backgroundColor: 'white',
                            color: '#666',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px'
                          }}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td style={cellStyle}>
                      <button 
                        onClick={() => handleRemove(item?._id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Remove
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div style={{ 
            display: window.innerWidth <= 768 ? 'block' : 'none'
          }}>
            {getSortedItems().map((listItem, idx) => {
              const { item, quantity } = listItem;
              return (
              <div
                key={idx}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '15px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: '1px solid #eee'
                }}
              >
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  {item?.itemImage?.url ? (
                    <img
                      src={item.itemImage.url}
                      alt={item.itemImage.altText || listItem.itemName}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '6px',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '6px',
                      backgroundColor: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      📦
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      color: '#333',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      margin: '0 0 5px 0'
                    }}>
                      {listItem.itemName || item?.itemName}
                    </h3>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '8px' }}>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: item?.originalPrice && (listItem.price || item?.price) < item?.originalPrice ? '#28a745' : '#333'
                      }}>
                        {formatPrice(listItem.price || item?.price)}
                      </span>
                      {item?.originalPrice && item?.originalPrice !== (listItem.price || item?.price) && (
                        <span style={{
                          textDecoration: 'line-through',
                          color: '#999'
                        }}>
                          {formatPrice(item?.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
                      {typeof listItem.store === 'string' ? listItem.store : (listItem.store?.name || 'Store not specified')} • {item?.unitDetails?.quantity} {item?.unitDetails?.unit || 'item'}
                    </div>
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: '#e9ecef',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      textTransform: 'capitalize'
                    }}>
                      {item?.category || 'other'}
                    </span>
                  </div>
                </div>
                {item?.promotion && (
                  <div style={{
                    marginTop: '10px',
                    padding: '8px',
                    backgroundColor: '#fff3cd',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}>
                    🏷️ {item.promotion}
                  </div>
                )}
                <div style={{ 
                  marginTop: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Quantity:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button 
                        onClick={() => handleUpdateQuantity(item?._id, quantity - 1)} 
                        disabled={quantity <= 1}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: '1px solid #ddd',
                          backgroundColor: quantity <= 1 ? '#f8f9fa' : 'white',
                          color: quantity <= 1 ? '#ccc' : '#666',
                          cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px'
                        }}
                      >
                        −
                      </button>
                      <span style={{ 
                        minWidth: '30px', 
                        textAlign: 'center',
                        fontWeight: '600',
                        fontSize: '1rem'
                      }}>
                        {quantity}
                      </span>
                      <button 
                        onClick={() => handleUpdateQuantity(item?._id, quantity + 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: '1px solid #ddd',
                          backgroundColor: 'white',
                          color: '#666',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemove(item?._id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default GroceryListPage;
