import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ItemList = () => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const fetchedPages = useRef(new Set());
  
  // Grocery list functionality state
  const [showAddToListModal, setShowAddToListModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userLists, setUserLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState('');
  const [addToListLoading, setAddToListLoading] = useState(false);
  const [addToListMessage, setAddToListMessage] = useState({ text: '', type: '' });
  
  // Grocery list functions
  const fetchUserLists = async () => {
    try {
      const token = localStorage.getItem('grocerease_token');
      const response = await fetch('/api/grocery-lists', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserLists(data.lists || []);
      }
    } catch (error) {
      console.error('Error fetching user lists:', error);
    }
  };

  const handleAddToListClick = (item) => {
    setSelectedItem(item);
    setShowAddToListModal(true);
    fetchUserLists();
  };

  const handleAddToList = async () => {
    if (!selectedListId || !selectedItem) {
      setAddToListMessage({ text: 'Please select a list', type: 'error' });
      return;
    }

    setAddToListLoading(true);
    setAddToListMessage({ text: '', type: '' });

    try {
      const token = localStorage.getItem('grocerease_token');
      const response = await fetch(`/api/grocery-lists/${selectedListId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          itemId: selectedItem._id,
          itemName: selectedItem.name,
          price: selectedItem.currentPrice,
          store: selectedItem.store?.name || ''
        })
      });

      const data = await response.json();

      if (response.ok) {
        setAddToListMessage({ text: 'Item added to list successfully!', type: 'success' });
        setTimeout(() => {
          setShowAddToListModal(false);
          setAddToListMessage({ text: '', type: '' });
          setSelectedListId('');
          setSelectedItem(null);
        }, 2000);
      } else {
        setAddToListMessage({ text: data.message || 'Failed to add item to list', type: 'error' });
      }
    } catch (error) {
      setAddToListMessage({ text: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setAddToListLoading(false);
    }
  };

  const fetchItems = async (pageNum) => {
    if (fetchedPages.current.has(pageNum)) return;
    
    try {
      setLoading(true);
      setError(null);
      fetchedPages.current.add(pageNum);

      const res = await fetch(`http://localhost:5000/api/items?page=${pageNum}&limit=20`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => pageNum === 1 ? data : [...prev, ...data]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(page);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  const formatPrice = (price) => {
    return price ? `$${price.toFixed(2)}` : '—';
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : '—';
  };

  if (error && items.length === 0) {
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
        <h2 style={{ color: '#dc3545', marginBottom: '10px' }}>Error Loading Items</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>{error}</p>
        <button 
          onClick={() => {
            setError(null);
            fetchedPages.current.clear();
            setPage(1);
            fetchItems(1);
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%'
    }}>
      <div style={{
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: '#333',
          marginBottom: '10px',
          fontSize: '2rem'
        }}>
          Browse All Items
        </h1>
        <p style={{ color: '#666' }}>
          Discover great deals on groceries from various stores
        </p>
      </div>

      {loading && items.length === 0 ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px'
        }}>
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#666'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 10px'
            }}></div>
            Loading items...
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div style={{ 
            display: window.innerWidth > 768 ? 'block' : 'none',
            overflowX: 'auto',
            marginBottom: '20px'
          }}>
            <table style={{
              borderCollapse: 'collapse',
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={headerStyle}>Item</th>
                  <th style={headerStyle}>Price</th>
                  <th style={headerStyle}>Original Price</th>
                  <th style={headerStyle}>Store</th>
                  <th style={headerStyle}>Unit</th>
                  <th style={headerStyle}>Category</th>
                  <th style={headerStyle}>Promotion</th>
                  <th style={headerStyle}>Deal Ends</th>
                  {isAuthenticated && <th style={headerStyle}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={cellStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {item.itemImage?.url && (
                          <img
                            src={item.itemImage.url}
                            alt={item.itemImage.altText || item.itemName}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '4px',
                              objectFit: 'cover'
                            }}
                          />
                        )}
                        <Link
                          to={`/item/${item._id}`}
                          style={{
                            color: '#007bff',
                            textDecoration: 'none',
                            fontWeight: '500'
                          }}
                        >
                          {item.itemName}
                        </Link>
                      </div>
                    </td>
                    <td style={cellStyle}>
                      <span style={{
                        fontWeight: 'bold',
                        color: item.originalPrice && item.price < item.originalPrice ? '#28a745' : '#333'
                      }}>
                        {formatPrice(item.price)}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      {item.originalPrice && item.originalPrice !== item.price ? (
                        <span style={{
                          textDecoration: 'line-through',
                          color: '#999'
                        }}>
                          {formatPrice(item.originalPrice)}
                        </span>
                      ) : '—'}
                    </td>
                    <td style={cellStyle}>{item.store?.name || '—'}</td>
                    <td style={cellStyle}>
                      {item.unitDetails?.quantity} {item.unitDetails?.unit || 'item'}
                    </td>
                    <td style={cellStyle}>
                      <span style={{
                        padding: '2px 8px',
                        backgroundColor: '#e9ecef',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        textTransform: 'capitalize'
                      }}>
                        {item.category || 'other'}
                      </span>
                    </td>
                    <td style={cellStyle}>{item.promotion || '—'}</td>
                    <td style={cellStyle}>{formatDate(item.dealValidUntil)}</td>
                    {isAuthenticated && (
                      <td style={cellStyle}>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToListClick(item);
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          📝 Add to List
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div style={{ 
            display: window.innerWidth <= 768 ? 'block' : 'none'
          }}>
            {items.map((item) => (
              <div
                key={item._id}
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
                  {item.itemImage?.url && (
                    <img
                      src={item.itemImage.url}
                      alt={item.itemImage.altText || item.itemName}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '6px',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <Link
                      to={`/item/${item._id}`}
                      style={{
                        color: '#007bff',
                        textDecoration: 'none',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        display: 'block',
                        marginBottom: '5px'
                      }}
                    >
                      {item.itemName}
                    </Link>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 'bold', color: '#28a745' }}>
                        {formatPrice(item.price)}
                      </span>
                      {item.originalPrice && item.originalPrice !== item.price && (
                        <span style={{
                          textDecoration: 'line-through',
                          color: '#999'
                        }}>
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
                      {item.store?.name} • {item.unitDetails?.quantity} {item.unitDetails?.unit || 'item'}
                    </div>
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: '#e9ecef',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      textTransform: 'capitalize'
                    }}>
                      {item.category || 'other'}
                    </span>
                  </div>
                </div>
                {item.promotion && (
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
                {isAuthenticated && (
                  <div style={{ marginTop: '15px' }}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToListClick(item);
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      📝 Add to List
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Loading indicator for infinite scroll */}
          {loading && items.length > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '20px'
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #007bff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          )}

          {/* End of list message */}
          {!hasMore && items.length > 0 && (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              color: '#666',
              borderTop: '1px solid #eee',
              marginTop: '20px'
            }}>
              You've reached the end of the list!
            </div>
          )}

          {/* Error message for pagination */}
          {error && items.length > 0 && (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              color: '#dc3545',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
              margin: '20px 0'
            }}>
              {error}
            </div>
          )}

          {/* Invisible loader element for intersection observer */}
          <div ref={loaderRef} style={{ height: '20px' }} />
        </>
      )}

      {/* Add to List Modal */}
      {showAddToListModal && selectedItem && (
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
                {selectedItem.itemImage?.url && (
                  <img 
                    src={selectedItem.itemImage.url}
                    alt={selectedItem.itemImage.altText || selectedItem.itemName}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '6px'
                    }}
                  />
                )}
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#333' }}>{selectedItem.itemName}</h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                    {formatPrice(selectedItem.price)} at {selectedItem.store?.name}
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
                onChange={(e) => setSelectedListId(e.target.value)}
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
                onClick={() => {
                  setShowAddToListModal(false);
                  setSelectedListId('');
                  setAddToListMessage({ text: '', type: '' });
                  setSelectedItem(null);
                }}
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
                onClick={handleAddToList}
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
      )}
    </div>
  );
};

// Styles
const headerStyle = {
  padding: '12px',
  textAlign: 'left',
  fontWeight: '600',
  color: '#333',
  borderBottom: '2px solid #dee2e6'
};

const cellStyle = {
  padding: '12px',
  textAlign: 'left',
  verticalAlign: 'middle'
};

export default ItemList;
