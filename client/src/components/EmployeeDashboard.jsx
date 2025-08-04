/**
 * Employee Dashboard Component
 * Implements S11-1 to S11-6: Employee stock management functionality
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const EmployeeDashboard = () => {
  const { user, token } = useAuth();
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
      {status.toUpperCase()}
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
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1>Employee Dashboard</h1>
        <p>Welcome, {user.name}! Manage your store's inventory below.</p>
        {user.employeeDetails && (
          <p style={{ color: '#666', fontSize: '14px' }}>
            Store: {user.employeeDetails.storeName} - {user.employeeDetails.storeLocation}
          </p>
        )}
      </div>

      {/* S11-5: Success/Error Messages */}
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {success}
        </div>
      )}

      {/* S11-1: Filters and Search */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>Search & Filter Products</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Search Products
            </label>
            <input
              type="text"
              value={filters.q}
              onChange={(e) => handleFilterChange('q', e.target.value)}
              placeholder="Search by name..."
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="all">All Categories</option>
              {availableFilters.categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Stock Status
            </label>
            <select
              value={filters.stockStatus}
              onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="all">All Status</option>
              {availableFilters.stockStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="itemName">Product Name</option>
              <option value="price">Price</option>
              <option value="category">Category</option>
              <option value="stockStatus">Stock Status</option>
              <option value="stockCount">Stock Count</option>
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
            <h3>Products ({pagination.totalItems} total)</h3>
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
                      <strong>Category:</strong> {product.category}
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
                  borderRadius: '4px'
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
                  borderRadius: '4px'
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
    </div>
  );
};

export default EmployeeDashboard;
