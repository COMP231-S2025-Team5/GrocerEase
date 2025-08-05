/**
 * Employee Dashboard Component (Refactored)
 * Modern, user-friendly interface for employee stock management
 * Now broken down into smaller, manageable components
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Import smaller components
import StoreHeader from './employee/StoreHeader';
import ProductFilters from './employee/ProductFilters';
import ProductList from './employee/ProductList';
import Pagination from './employee/Pagination';
import StockUpdateModal from './employee/StockUpdateModal';
import AddItemModal from './employee/AddItemModal';
import EditItemModal from './employee/EditItemModal';

const EmployeeDashboard = () => {
  const { user, token } = useAuth();

  // Helper function to format category names to CamelCase
  const formatCategoryName = (category) => {
    if (!category) return '';
    
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  };

  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({
    q: '',
    category: 'all',
    stockStatus: 'all',
    sortBy: 'itemName',
    sortOrder: 'asc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
    stockStatuses: []
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockUpdateModal, setStockUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    stockStatus: '',
    reason: '',
    stockCount: ''
  });
  const [storeInfo, setStoreInfo] = useState(null);
  
  // Modal states for item management
  const [addItemModal, setAddItemModal] = useState(false);
  const [editItemModal, setEditItemModal] = useState(false);
  const [newItemData, setNewItemData] = useState({
    itemName: '',
    category: '',
    price: '',
    unitDetails: { unit: 'item', quantity: 1 },
    stockCount: '',
    stockStatus: 'in-stock'
  });
  const [editItemData, setEditItemData] = useState({});

  // Fetch products with sorting and filtering
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    setError('');
    
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page: page.toString(),
        limit: '20'
      });

      const response = await fetch(`http://localhost:5000/api/employee/products?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
        setAvailableFilters(data.data.filters);
        setStoreInfo(data.data.employeeStore);
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'employee') {
      fetchProducts();
    }
  }, [filters, user, token]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Select product for stock update
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setUpdateData({
      stockStatus: product.stockStatus,
      reason: '',
      stockCount: product.stockCount || ''
    });
    setStockUpdateModal(true);
    setError('');
    setSuccess('');
  };

  // Update stock status
  const handleStockUpdate = async () => {
    if (!selectedProduct || !updateData.stockStatus) {
      setError('Please select a stock status');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/employee/products/${selectedProduct._id}/stock-status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setStockUpdateModal(false);
        setSelectedProduct(null);
        fetchProducts(pagination.currentPage);
      } else {
        setError(data.message || 'Failed to update stock status');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick out-of-stock button
  const handleQuickOutOfStock = async (product) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/employee/products/${product._id}/stock-status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            stockStatus: 'out-of-stock',
            reason: 'Marked as out of stock by employee',
            stockCount: 0
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(`${product.itemName} marked as out of stock`);
        fetchProducts(pagination.currentPage);
      } else {
        setError(data.message || 'Failed to mark as out of stock');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add new item
  const handleAddItem = async () => {
    if (!newItemData.itemName || !newItemData.category || !newItemData.price) {
      setError('Item name, category, and price are required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/employee/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItemData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Item added successfully');
        setAddItemModal(false);
        setNewItemData({
          itemName: '',
          category: '',
          price: '',
          unitDetails: { unit: 'item', quantity: 1 },
          stockCount: '',
          stockStatus: 'in-stock'
        });
        fetchProducts(pagination.currentPage);
      } else {
        setError(data.message || 'Failed to add item');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Edit item
  const handleEditItem = (product) => {
    setSelectedProduct(product);
    setEditItemData({
      itemName: product.itemName,
      category: product.category,
      price: product.price,
      unitDetails: product.unitDetails || { unit: 'item', quantity: 1 },
      stockCount: product.stockCount || '',
      stockStatus: product.stockStatus
    });
    setEditItemModal(true);
    setError('');
    setSuccess('');
  };

  // Update item
  const handleUpdateItem = async () => {
    if (!editItemData.itemName || !editItemData.category || !editItemData.price) {
      setError('Item name, category, and price are required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/employee/products/${selectedProduct._id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editItemData)
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess('Item updated successfully');
        setEditItemModal(false);
        setSelectedProduct(null);
        fetchProducts(pagination.currentPage);
      } else {
        setError(data.message || 'Failed to update item');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Remove item
  const handleRemoveItem = async (product) => {
    if (!window.confirm(`Are you sure you want to remove "${product.itemName}" from the store?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/employee/products/${product._id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(`${product.itemName} removed successfully`);
        fetchProducts(pagination.currentPage);
      } else {
        setError(data.message || 'Failed to remove item');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for status display
  const getStatusColor = (status) => {
    switch (status) {
      case 'in-stock': return '#28a745';
      case 'out-of-stock': return '#dc3545';
      case 'low-stock': return '#ffc107';
      case 'discontinued': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getStatusBadge = (status) => (
    <span style={{
      backgroundColor: getStatusColor(status),
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold'
    }}>
      {status ? status.toUpperCase() : 'UNKNOWN'}
    </span>
  );

  // Modal handlers
  const handleAddItemModalOpen = () => {
    setAddItemModal(true);
    setError('');
    setSuccess('');
  };

  const handleAddItemModalCancel = () => {
    setAddItemModal(false);
    setNewItemData({
      itemName: '',
      category: '',
      price: '',
      unitDetails: { unit: 'item', quantity: 1 },
      stockCount: '',
      stockStatus: 'in-stock'
    });
    setError('');
  };

  const handleStockUpdateCancel = () => {
    setStockUpdateModal(false);
    setSelectedProduct(null);
    setError('');
  };

  const handleEditItemCancel = () => {
    setEditItemModal(false);
    setSelectedProduct(null);
    setError('');
  };

  // Access control
  if (!user || user.role !== 'employee') {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>This page is only accessible to employees.</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      minHeight: 'calc(100vh - 60px)'
    }}>
      
      {/* Store Information Header */}
      <StoreHeader 
        user={user} 
        storeInfo={storeInfo} 
        totalItems={pagination.totalItems} 
      />

      {/* Success/Error Messages */}
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          ❌ {error}
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          ✅ {success}
        </div>
      )}

      {/* Search and Filter Controls */}
      <ProductFilters 
        filters={filters}
        availableFilters={availableFilters}
        onFilterChange={handleFilterChange}
        formatCategoryName={formatCategoryName}
      />

      {/* Products List */}
      <ProductList 
        products={products}
        loading={loading}
        pagination={pagination}
        storeInfo={storeInfo}
        formatCategoryName={formatCategoryName}
        getStatusBadge={getStatusBadge}
        onAddItem={handleAddItemModalOpen}
        onQuickOutOfStock={handleQuickOutOfStock}
        onSelectProduct={handleSelectProduct}
        onEditItem={handleEditItem}
        onRemoveItem={handleRemoveItem}
      />

      {/* Pagination */}
      <Pagination 
        pagination={pagination}
        onPageChange={fetchProducts}
      />

      {/* Stock Update Modal */}
      <StockUpdateModal 
        isOpen={stockUpdateModal}
        selectedProduct={selectedProduct}
        updateData={updateData}
        loading={loading}
        getStatusBadge={getStatusBadge}
        onUpdateData={setUpdateData}
        onConfirm={handleStockUpdate}
        onCancel={handleStockUpdateCancel}
      />

      {/* Add Item Modal */}
      <AddItemModal 
        isOpen={addItemModal}
        itemData={newItemData}
        availableFilters={availableFilters}
        loading={loading}
        formatCategoryName={formatCategoryName}
        onItemDataChange={setNewItemData}
        onConfirm={handleAddItem}
        onCancel={handleAddItemModalCancel}
      />

      {/* Edit Item Modal */}
      <EditItemModal 
        isOpen={editItemModal}
        selectedProduct={selectedProduct}
        editData={editItemData}
        availableFilters={availableFilters}
        loading={loading}
        formatCategoryName={formatCategoryName}
        onEditDataChange={setEditItemData}
        onConfirm={handleUpdateItem}
        onCancel={handleEditItemCancel}
      />
    </div>
  );
};

export default EmployeeDashboard;
