/**
 * Employee Dashboard Component
 * Modern, user-friendly interface for employee stock management
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const EmployeeDashboard = () => {
  const { user, token } = useAuth();

  // Helper function to format category names to CamelCase
  const formatCategoryName = (category) => {
    if (!category) return '';
    
    // Convert to CamelCase: split by hyphens, capitalize each word, join without spaces
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  };
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
  
  // New states for item management
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

  // S11-1: Fetch products with sorting and filtering
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

  // S11-1: Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // S11-3: Select product for stock update
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

  // S11-2, S11-4: Update stock status
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
        // S11-5: Success handler
        setSuccess(data.message);
        setStockUpdateModal(false);
        setSelectedProduct(null);
        // Refresh products list
        fetchProducts(pagination.currentPage);
      } else {
        // S11-5: Failure handler
        setError(data.message || 'Failed to update stock status');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // S11-2: Quick out-of-stock button
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
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '30px',
        marginBottom: '30px',
        border: '1px solid #e1e5e9'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{
              color: '#333',
              marginBottom: '10px',
              fontSize: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              👷 Employee Dashboard
            </h1>
            <p style={{
              color: '#666',
              fontSize: '1.1rem',
              margin: '0 0 10px 0'
            }}>
              Welcome back, <strong>{user.name}</strong>!
            </p>
            {user.employeeDetails && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#e3f2fd',
                padding: '10px 15px',
                borderRadius: '8px',
                border: '1px solid #bbdefb'
              }}>
                <span style={{ fontSize: '1.2rem' }}>🏪</span>
                <div>
                  <strong style={{ color: '#1976d2' }}>
                    {storeInfo?.name || user.employeeDetails?.storeName || 'Store Name'}
                  </strong>
                  <span style={{ color: '#666', marginLeft: '10px' }}>
                    📍 {storeInfo?.location || user.employeeDetails?.storeLocation || 'Location'}
                  </span>
                  {storeInfo && (
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                      Showing products from your assigned store only
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Quick Stats */}
          <div style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              backgroundColor: '#e8f5e8',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center',
              minWidth: '120px',
              border: '1px solid #c8e6c9'
            }}>
              <div style={{ fontSize: '1.5rem', color: '#2e7d32' }}>📦</div>
              <div style={{ fontWeight: 'bold', color: '#2e7d32' }}>{pagination.totalItems}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Total Products</div>
            </div>
          </div>
        </div>
      </div>

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

      {/* Modern Filters and Search */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '25px',
        marginBottom: '25px',
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
          Search & Filter Products
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          alignItems: 'end'
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Search Products
            </label>
            <input
              type="text"
              value={filters.q}
              onChange={(e) => handleFilterChange('q', e.target.value)}
              placeholder="Search by product name..."
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'border-color 0.2s',
                outline: 'none',
                backgroundColor: 'white',
                color: '#333'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: '#333',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Categories</option>
              {availableFilters.categories.map(cat => (
                <option key={cat} value={cat} style={{ color: '#333', backgroundColor: 'white' }}>
                  {formatCategoryName(cat)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Stock Status
            </label>
            <select
              value={filters.stockStatus}
              onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: '#333',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Status</option>
              {availableFilters.stockStatuses.map(status => (
                <option key={status} value={status} style={{ color: '#333', backgroundColor: 'white' }}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: '#333',
                cursor: 'pointer'
              }}
            >
              <option value="itemName" style={{ color: '#333', backgroundColor: 'white' }}>📝 Name</option>
              <option value="category" style={{ color: '#333', backgroundColor: 'white' }}>📂 Category</option>
              <option value="price" style={{ color: '#333', backgroundColor: 'white' }}>💰 Price</option>
              <option value="stockStatus" style={{ color: '#333', backgroundColor: 'white' }}>📊 Stock Status</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Order
            </label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: '#333',
                cursor: 'pointer'
              }}
            >
              <option value="asc" style={{ color: '#333', backgroundColor: 'white' }}>⬆️ Ascending</option>
              <option value="desc" style={{ color: '#333', backgroundColor: 'white' }}>⬇️ Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading products...</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '10px'
            }}>
              <h3 style={{ 
                color: '#333', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                fontSize: '1.4rem',
                margin: 0
              }}>
                🛒 Store Inventory
                <span style={{ 
                  fontSize: '1rem', 
                  color: '#666', 
                  fontWeight: 'normal' 
                }}>
                  ({pagination.totalItems} products{storeInfo?.name ? ` at ${storeInfo.name}` : ''})
                </span>
              </h3>
              
              <button
                onClick={() => {
                  setAddItemModal(true);
                  setError('');
                  setSuccess('');
                }}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                ➕ Add New Item
              </button>
            </div>
            {storeInfo && (
              <p style={{ 
                color: '#666', 
                fontSize: '14px', 
                margin: '5px 0 0 0',
                fontStyle: 'italic'
              }}>
                You can only view and manage products from your assigned store: <strong>{storeInfo.name}</strong>
              </p>
            )}
          </div>

          <div style={{ display: 'grid', gap: '15px' }}>
            {products.map(product => (
              <div key={product._id} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>{product.itemName}</h4>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Price:</strong> ${product.price.toFixed(2)}
                      {product.unitDetails && ` per ${product.unitDetails.unit}`}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Category:</strong> {formatCategoryName(product.category)}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Stock Count:</strong> {product.stockCount || 0}
                    </p>
                    <div style={{ margin: '10px 0' }}>
                      <strong>Status: </strong>
                      {getStatusBadge(product.stockStatus)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '200px' }}>
                    {/* S11-2: Quick Out of Stock Button */}
                    {product.stockStatus !== 'out-of-stock' && (
                      <button
                        onClick={() => handleQuickOutOfStock(product)}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                        disabled={loading}
                      >
                        Mark Out of Stock
                      </button>
                    )}

                    {/* S11-3: Select Product Button */}
                    <button
                      onClick={() => handleSelectProduct(product)}
                      style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Update Stock
                    </button>

                    {/* Edit Item Button */}
                    <button
                      onClick={() => handleEditItem(product)}
                      style={{
                        backgroundColor: '#ffc107',
                        color: '#212529',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      Edit Item
                    </button>

                    {/* Remove Item Button */}
                    <button
                      onClick={() => handleRemoveItem(product)}
                      style={{
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {product.lastStockUpdate && (
                  <div style={{
                    marginTop: '10px',
                    padding: '10px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#666'
                  }}>
                    <strong>Last Updated:</strong> {new Date(product.lastStockUpdate.updatedAt).toLocaleString()} 
                    by {product.lastStockUpdate.employeeName}
                    {product.lastStockUpdate.reason && (
                      <><br /><strong>Reason:</strong> {product.lastStockUpdate.reason}</>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              {pagination.hasPrevPage && (
                <button
                  onClick={() => fetchProducts(pagination.currentPage - 1)}
                  style={{
                    margin: '0 5px',
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Previous
                </button>
              )}
              
              <span style={{ margin: '0 15px' }}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              {pagination.hasNextPage && (
                <button
                  onClick={() => fetchProducts(pagination.currentPage + 1)}
                  style={{
                    margin: '0 5px',
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Next
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Stock Update Modal */}
      {stockUpdateModal && selectedProduct && (
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
                onChange={(e) => setUpdateData(prev => ({ ...prev, stockStatus: e.target.value }))}
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
                onChange={(e) => setUpdateData(prev => ({ ...prev, stockCount: e.target.value }))}
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
                onChange={(e) => setUpdateData(prev => ({ ...prev, reason: e.target.value }))}
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
                onClick={() => {
                  setStockUpdateModal(false);
                  setSelectedProduct(null);
                  setError('');
                }}
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
                onClick={handleStockUpdate}
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
      )}

      {/* Add Item Modal */}
      {addItemModal && (
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
                  value={newItemData.itemName}
                  onChange={(e) => setNewItemData(prev => ({ ...prev, itemName: e.target.value }))}
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
                  value={newItemData.category}
                  onChange={(e) => setNewItemData(prev => ({ ...prev, category: e.target.value }))}
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
                  value={newItemData.price}
                  onChange={(e) => setNewItemData(prev => ({ ...prev, price: e.target.value }))}
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
                  value={newItemData.stockCount}
                  onChange={(e) => setNewItemData(prev => ({ ...prev, stockCount: e.target.value }))}
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
                  value={newItemData.unitDetails.unit}
                  onChange={(e) => setNewItemData(prev => ({ 
                    ...prev, 
                    unitDetails: { ...prev.unitDetails, unit: e.target.value }
                  }))}
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
                  value={newItemData.stockStatus}
                  onChange={(e) => setNewItemData(prev => ({ ...prev, stockStatus: e.target.value }))}
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
                onClick={() => {
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
                }}
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
                onClick={handleAddItem}
                disabled={!newItemData.itemName || !newItemData.category || !newItemData.price || loading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: (newItemData.itemName && newItemData.category && newItemData.price) ? '#28a745' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: (newItemData.itemName && newItemData.category && newItemData.price) ? 'pointer' : 'not-allowed'
                }}
              >
                {loading ? 'Adding...' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editItemModal && selectedProduct && (
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
            <h3>Edit Item Details</h3>
            <p><strong>Product:</strong> {selectedProduct.itemName}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Item Name *
                </label>
                <input
                  type="text"
                  value={editItemData.itemName}
                  onChange={(e) => setEditItemData(prev => ({ ...prev, itemName: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    color: '#333'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Category *
                </label>
                <select
                  value={editItemData.category}
                  onChange={(e) => setEditItemData(prev => ({ ...prev, category: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    color: '#333'
                  }}
                >
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
                  value={editItemData.price}
                  onChange={(e) => setEditItemData(prev => ({ ...prev, price: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    color: '#333'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Stock Count
                </label>
                <input
                  type="number"
                  value={editItemData.stockCount}
                  onChange={(e) => setEditItemData(prev => ({ ...prev, stockCount: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    color: '#333'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Unit
                </label>
                <select
                  value={editItemData.unitDetails?.unit || 'item'}
                  onChange={(e) => setEditItemData(prev => ({ 
                    ...prev, 
                    unitDetails: { ...prev.unitDetails, unit: e.target.value }
                  }))}
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
                  value={editItemData.stockStatus}
                  onChange={(e) => setEditItemData(prev => ({ ...prev, stockStatus: e.target.value }))}
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
                onClick={() => {
                  setEditItemModal(false);
                  setSelectedProduct(null);
                  setError('');
                }}
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
                onClick={handleUpdateItem}
                disabled={!editItemData.itemName || !editItemData.category || !editItemData.price || loading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: (editItemData.itemName && editItemData.category && editItemData.price) ? '#28a745' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: (editItemData.itemName && editItemData.category && editItemData.price) ? 'pointer' : 'not-allowed'
                }}
              >
                {loading ? 'Updating...' : 'Update Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
