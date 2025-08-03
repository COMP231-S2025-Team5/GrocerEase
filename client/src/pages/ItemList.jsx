import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const fetchedPages = useRef(new Set());
  
const handleAddToList = async (item) => {
  try {
    const userId = '688f89f255330171c2a751a5'; // Replace with actual user ID

    const res = await fetch(`http://localhost:5000/api/grocery-lists/user/${userId}/add-item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemId: item._id }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(`Added "${item.itemName}" to your list.`);
    } else {
      console.error('Server responded with error:', data.message);
      alert(`Error: ${data.message}`);
    }
  } catch (err) {
    console.error('Add to list failed:', err);
    alert('Failed to add item to list.');
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
