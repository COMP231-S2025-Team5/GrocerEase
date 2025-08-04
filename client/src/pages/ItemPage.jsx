import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Report functionality state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportMessage, setReportMessage] = useState({ text: '', type: '' });
  const [hasReported, setHasReported] = useState(false);
  const [reportReasons, setReportReasons] = useState([]);

  // Grocery list functionality state
  const [showAddToListModal, setShowAddToListModal] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState('');
  const [addToListLoading, setAddToListLoading] = useState(false);
  const [addToListMessage, setAddToListMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchItem();
    fetchReportReasons();
    if (isAuthenticated && id) {
      checkReportStatus();
      fetchUserLists();
    }
  }, [id, isAuthenticated]);

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

  const fetchReportReasons = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reports/reasons');
      if (response.ok) {
        const data = await response.json();
        setReportReasons(data.data);
      }
    } catch (error) {
      console.error('Error fetching report reasons:', error);
    }
  };

  const checkReportStatus = async () => {
    try {
      const token = localStorage.getItem('grocerease_token');
      if (!token) return;

      const response = await fetch(`http://localhost:5000/api/reports/check/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHasReported(data.data.hasReported);
      }
    } catch (error) {
      console.error('Error checking report status:', error);
    }
  };

  const handleReportSubmit = async () => {
    if (!reportReason) {
      setReportMessage({ text: 'Please select a reason for reporting this item.', type: 'error' });
      return;
    }

    setReportLoading(true);
    setReportMessage({ text: '', type: '' });

    try {
      const token = localStorage.getItem('grocerease_token');
      if (!token) {
        setReportMessage({ text: 'Authentication token not found. Please log in again.', type: 'error' });
        setReportLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          itemId: id,
          reason: reportReason,
          description: reportDescription.trim() || undefined
        })
      });

      const data = await response.json();

      if (response.ok) {
        setReportMessage({ text: data.message, type: 'success' });
        setHasReported(true);
        setTimeout(() => {
          setShowReportModal(false);
          setReportReason('');
          setReportDescription('');
          setReportMessage({ text: '', type: '' });
        }, 2000);
      } else {
        setReportMessage({ text: data.message, type: 'error' });
      }
    } catch (error) {
      setReportMessage({ text: 'Failed to submit report. Please try again.', type: 'error' });
    } finally {
      setReportLoading(false);
    }
  };

  const handleReportCancel = () => {
    setShowReportModal(false);
    setReportReason('');
    setReportDescription('');
    setReportMessage({ text: '', type: '' });
  };

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

  const handleAddToList = async () => {
    if (!selectedListId) {
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
          itemId: item._id,
          itemName: item.itemName,
          price: item.price,
          store: item.store?.name || ''
        })
      });

      const data = await response.json();

      if (response.ok) {
        setAddToListMessage({ text: 'Item added to list successfully!', type: 'success' });
        setTimeout(() => {
          setShowAddToListModal(false);
          setAddToListMessage({ text: '', type: '' });
          setSelectedListId('');
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
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
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

          {/* Report Item Button - Only show if authenticated */}
          {isAuthenticated && (
            <button
              onClick={() => {
                if (hasReported) {
                  setReportMessage({ text: 'You have already reported this item.', type: 'info' });
                  setTimeout(() => setReportMessage({ text: '', type: '' }), 3000);
                } else {
                  setShowReportModal(true);
                }
              }}
              disabled={hasReported}
              style={{
                padding: '12px 30px',
                backgroundColor: hasReported ? '#6c757d' : '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: hasReported ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                opacity: hasReported ? 0.6 : 1
              }}
            >
              {hasReported ? '✓ Reported' : '🚩 Report Item'}
            </button>
          )}

          {/* Add to List Button - Only show if authenticated */}
          {isAuthenticated && (
            <button
              onClick={() => setShowAddToListModal(true)}
              style={{
                padding: '12px 30px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                marginLeft: '15px'
              }}
            >
              📝 Add to List
            </button>
          )}
        </div>

        {/* Show message for report actions */}
        {reportMessage.text && !showReportModal && (
          <div style={{
            marginTop: '15px',
            padding: '10px 15px',
            borderRadius: '6px',
            backgroundColor: reportMessage.type === 'success' ? '#d4edda' : 
                            reportMessage.type === 'error' ? '#f8d7da' : '#d1ecf1',
            border: `1px solid ${reportMessage.type === 'success' ? '#c3e6cb' : 
                                 reportMessage.type === 'error' ? '#f5c6cb' : '#bee5eb'}`,
            color: reportMessage.type === 'success' ? '#155724' : 
                   reportMessage.type === 'error' ? '#721c24' : '#0c5460',
            maxWidth: '500px',
            margin: '15px auto'
          }}>
            {reportMessage.text}
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{
                color: '#333',
                marginBottom: '10px',
                fontSize: '1.5rem',
                fontWeight: '600'
              }}>
                🚩 Report Item
              </h2>
              <p style={{ color: '#666', margin: 0 }}>
                Help us improve by reporting issues with "{item.itemName}"
              </p>
            </div>

            {/* Report Message */}
            {reportMessage.text && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '6px',
                marginBottom: '20px',
                backgroundColor: reportMessage.type === 'success' ? '#d4edda' : '#f8d7da',
                border: `1px solid ${reportMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                color: reportMessage.type === 'success' ? '#155724' : '#721c24'
              }}>
                {reportMessage.text}
              </div>
            )}

            {/* Reason Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: '600',
                color: '#333'
              }}>
                Reason for Report *
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
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
                <option value="">Select a reason...</option>
                {reportReasons.map(reason => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Description */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: '600',
                color: '#333'
              }}>
                Additional Details (Optional)
              </label>
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Provide any additional details about the issue..."
                maxLength={500}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '6px',
                  fontSize: '16px',
                  outline: 'none',
                  backgroundColor: '#f0f8ff',
                  color: '#333',
                  minHeight: '80px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              <div style={{
                textAlign: 'right',
                fontSize: '12px',
                color: '#666',
                marginTop: '5px'
              }}>
                {reportDescription.length}/500 characters
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleReportCancel}
                disabled={reportLoading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: reportLoading ? 'not-allowed' : 'pointer',
                  opacity: reportLoading ? 0.6 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={reportLoading || !reportReason}
                style={{
                  padding: '12px 24px',
                  backgroundColor: reportLoading || !reportReason ? '#6c757d' : '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: reportLoading || !reportReason ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {reportLoading && (
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
                {reportLoading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add to List Modal */}
      {showAddToListModal && (
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

export default ItemPage;
