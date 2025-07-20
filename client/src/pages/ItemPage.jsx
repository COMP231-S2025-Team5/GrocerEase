import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const ItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:5000/api/items/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Item not found');
        }
        throw new Error('Failed to fetch item details');
      }
      
      const data = await response.json();
      setItem(data);
    } catch (err) {
      console.error('Error fetching item:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return price ? `$${price.toFixed(2)}` : 'N/A';
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'N/A';
  };

  const calculateSavings = (originalPrice, currentPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return null;
    const savings = originalPrice - currentPrice;
    const percentage = ((savings / originalPrice) * 100).toFixed(0);
    return { amount: savings, percentage };
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 60px)',
        flexDirection: 'column'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <p style={{ color: '#666' }}>Loading item details...</p>
      </div>
    );
  }

  if (error) {
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
        <div style={{
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          padding: '30px',
          maxWidth: '500px'
        }}>
          <h2 style={{ color: '#721c24', marginBottom: '15px' }}>
            {error === 'Item not found' ? '🔍 Item Not Found' : '❌ Error'}
          </h2>
          <p style={{ color: '#721c24', marginBottom: '20px' }}>
            {error === 'Item not found' 
              ? "Sorry, we couldn't find the item you're looking for. It may have been removed or the link might be incorrect."
              : error
            }
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/itemlist')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              Browse Items
            </button>
            <button
              onClick={() => navigate('/search')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Search Items
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!item) return null;

  const savings = calculateSavings(item.originalPrice, item.price);
  const isOnSale = savings !== null;

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
      backgroundColor: '#f8f9fa',
      minHeight: 'calc(100vh - 60px)'
    }}>
      {/* Breadcrumb Navigation */}
      <nav style={{
        marginBottom: '30px',
        fontSize: '14px',
        color: '#666'
      }}>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        <Link to="/itemlist" style={{ color: '#007bff', textDecoration: 'none' }}>Items</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        <span>{item.itemName}</span>
      </nav>

      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 768 ? '1fr 2fr' : '1fr',
        gap: '40px',
        marginBottom: '30px'
      }}>
        {/* Image Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}>
          {item.itemImage?.url ? (
            <img
              src={item.itemImage.url}
              alt={item.itemImage.altText || item.itemName}
              style={{
                width: '100%',
                maxWidth: '400px',
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid #e1e5e9'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              maxWidth: '400px',
              height: '300px',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed #dee2e6',
              color: '#6c757d'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>🛒</div>
                <p>No image available</p>
              </div>
            </div>
          )}
        </div>

        {/* Item Details Section */}
        <div>
          {/* Title and Category */}
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '10px',
              lineHeight: '1.2'
            }}>
              {item.itemName}
            </h1>
            
            {item.category && (
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                backgroundColor: '#e7f3ff',
                color: '#0066cc',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '500',
                textTransform: 'capitalize'
              }}>
                {item.category}
              </span>
            )}
          </div>

          {/* Pricing Section */}
          <div style={{
            backgroundColor: isOnSale ? '#f8f9fa' : 'white',
            border: isOnSale ? '2px solid #28a745' : '1px solid #dee2e6',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '25px'
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px', marginBottom: '10px' }}>
              <span style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: isOnSale ? '#28a745' : '#333'
              }}>
                {formatPrice(item.price)}
              </span>
              
              {isOnSale && (
                <span style={{
                  fontSize: '1.5rem',
                  textDecoration: 'line-through',
                  color: '#999'
                }}>
                  {formatPrice(item.originalPrice)}
                </span>
              )}
            </div>

            {savings && (
              <div style={{
                backgroundColor: '#d4edda',
                color: '#155724',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontWeight: '600'
              }}>
                💰 Save {formatPrice(savings.amount)} ({savings.percentage}% off!)
              </div>
            )}

            {item.unitDetails && (
              <div style={{ marginTop: '15px' }}>
                <p style={{ color: '#666', fontSize: '0.95rem', margin: '5px 0' }}>
                  <strong>Unit:</strong> {item.unitDetails.quantity} {item.unitDetails.unit || 'item'}
                </p>
                {item.unitDetails.pricePerUnit && (
                  <p style={{ color: '#666', fontSize: '0.95rem', margin: '5px 0' }}>
                    <strong>Price per {item.unitDetails.unit || 'item'}:</strong> {formatPrice(item.unitDetails.pricePerUnit)}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Store Information */}
          {item.store && (
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '25px'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#333',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🏪 Store Information
              </h3>
              
              <div style={{ display: 'grid', gap: '8px' }}>
                <p style={{ margin: 0 }}>
                  <strong>Store:</strong> {item.store.name}
                </p>
                {item.store.location && (
                  <p style={{ margin: 0, color: '#666' }}>
                    <strong>Location:</strong> {item.store.location}
                  </p>
                )}
                {item.store.address && (
                  <p style={{ margin: 0, color: '#666' }}>
                    <strong>Address:</strong> {item.store.address}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Promotion Details */}
          {item.promotion && (
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
                {item.promotion}
              </p>
              {item.dealValidUntil && (
                <p style={{ color: '#856404', margin: '10px 0 0 0', fontSize: '0.9rem' }}>
                  <strong>Valid until:</strong> {formatDate(item.dealValidUntil)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '25px',
        marginTop: '40px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#333',
          marginBottom: '20px'
        }}>
          📋 Item Details
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
          gap: '15px',
          color: '#333'
        }}>
          <div>
            <strong>Item Name:</strong> {item.itemName}
          </div>
          <div>
            <strong>Category:</strong> {item.category || 'Not specified'}
          </div>
          <div>
            <strong>Current Price:</strong> {formatPrice(item.price)}
          </div>
          {item.originalPrice && (
            <div>
              <strong>Original Price:</strong> {formatPrice(item.originalPrice)}
            </div>
          )}
          {item.unitDetails && (
            <>
              <div>
                <strong>Quantity:</strong> {item.unitDetails.quantity} {item.unitDetails.unit || 'item'}
              </div>
              {item.unitDetails.pricePerUnit && (
                <div>
                  <strong>Price per Unit:</strong> {formatPrice(item.unitDetails.pricePerUnit)}
                </div>
              )}
            </>
          )}
          <div>
            <strong>Store:</strong> {item.store?.name || 'Not specified'}
          </div>
          {item.store?.location && (
            <div>
              <strong>Store Location:</strong> {item.store.location}
            </div>
          )}
          {item.promotion && (
            <div style={{ gridColumn: window.innerWidth > 768 ? '1 / -1' : 'auto' }}>
              <strong>Promotion:</strong> {item.promotion}
            </div>
          )}
          {item.dealValidUntil && (
            <div>
              <strong>Deal Valid Until:</strong> {formatDate(item.dealValidUntil)}
            </div>
          )}
          <div>
            <strong>Last Updated:</strong> {formatDate(item.updatedAt)}
          </div>
        </div>
      </div>

      {/* Back to Browse Button */}
      <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>
        <Link
          to="/itemlist"
          style={{
            display: 'inline-block',
            padding: '12px 30px',
            backgroundColor: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'background-color 0.2s'
          }}
        >
          ← Back to All Items
        </Link>
      </div>
    </div>
  );
};

export default ItemPage;
