/**
 * Item Page Component (Refactored)
 * Displays detailed item information with modular components
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Import smaller components
import LoadingSpinner from '../components/item/LoadingSpinner';
import ErrorDisplay from '../components/item/ErrorDisplay';
import ItemBreadcrumb from '../components/item/ItemBreadcrumb';
import ItemImage from '../components/item/ItemImage';
import ItemDetails from '../components/item/ItemDetails';
import StoreInfoCard from '../components/item/StoreInfoCard';
import PromotionCard from '../components/item/PromotionCard';
import ItemSpecifications from '../components/item/ItemSpecifications';
import ActionButtons from '../components/item/ActionButtons';
import ReportModal from '../components/item/ReportModal';
import AddToListModal from '../components/item/AddToListModal';

const ItemPage = () => {
  const { id } = useParams();
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

  // Utility functions
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

  const formatCategoryName = (category) => {
    if (!category) return '';
    
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  };

  // Data fetching functions
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

  // Report functionality
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

  const handleReportClick = () => {
    if (hasReported) {
      setReportMessage({ text: 'You have already reported this item.', type: 'info' });
      setTimeout(() => setReportMessage({ text: '', type: '' }), 3000);
    } else {
      setShowReportModal(true);
    }
  };

  // Add to list functionality
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

  const handleAddToListCancel = () => {
    setShowAddToListModal(false);
    setSelectedListId('');
    setAddToListMessage({ text: '', type: '' });
  };

  // Loading and error states
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!item) return null;

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
      <ItemBreadcrumb itemName={item.itemName} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 768 ? '1fr 2fr' : '1fr',
        gap: '40px',
        marginBottom: '30px'
      }}>
        {/* Image Section */}
        <ItemImage itemImage={item.itemImage} itemName={item.itemName} />

        {/* Item Details Section */}
        <div>
          <ItemDetails 
            item={item}
            formatCategoryName={formatCategoryName}
            formatPrice={formatPrice}
            calculateSavings={calculateSavings}
          />

          {/* Store Information */}
          <StoreInfoCard store={item.store} />

          {/* Promotion Details */}
          <PromotionCard 
            promotion={item.promotion}
            dealValidUntil={item.dealValidUntil}
            formatDate={formatDate}
          />
        </div>
      </div>

      {/* Additional Information */}
      <ItemSpecifications 
        item={item}
        formatCategoryName={formatCategoryName}
        formatPrice={formatPrice}
        formatDate={formatDate}
      />

      {/* Action Buttons */}
      <ActionButtons 
        isAuthenticated={isAuthenticated}
        hasReported={hasReported}
        reportMessage={reportMessage}
        onReportClick={handleReportClick}
        onAddToListClick={() => setShowAddToListModal(true)}
      />

      {/* Report Modal */}
      <ReportModal 
        isOpen={showReportModal}
        item={item}
        reportReasons={reportReasons}
        reportReason={reportReason}
        reportDescription={reportDescription}
        reportMessage={reportMessage}
        reportLoading={reportLoading}
        onReasonChange={setReportReason}
        onDescriptionChange={setReportDescription}
        onSubmit={handleReportSubmit}
        onCancel={handleReportCancel}
      />

      {/* Add to List Modal */}
      <AddToListModal 
        isOpen={showAddToListModal}
        item={item}
        userLists={userLists}
        selectedListId={selectedListId}
        addToListMessage={addToListMessage}
        addToListLoading={addToListLoading}
        onListSelect={setSelectedListId}
        onConfirm={handleAddToList}
        onCancel={handleAddToListCancel}
      />
    </div>
  );
};

export default ItemPage;
