import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    stores: [],
    units: [],
    priceRange: { minPrice: 0, maxPrice: 100 }
  });
  const [pagination, setPagination] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Form state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedStore, setSelectedStore] = useState(searchParams.get('store') || '');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || ''
  });
  const [selectedUnit, setSelectedUnit] = useState(searchParams.get('unit') || 'all');
  const [hasPromotion, setHasPromotion] = useState(searchParams.get('hasPromotion') === 'true');
  const [validDealsOnly, setValidDealsOnly] = useState(searchParams.get('validDealsOnly') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'relevance');
  
  const searchTimeout = useRef(null);
  const currentPage = parseInt(searchParams.get('page')) || 1;

  // Fetch filter options on component mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Perform search when URL params change
  useEffect(() => {
    if (searchParams.toString()) {
      performSearch();
    }
  }, [searchParams]);

  // Auto-search as user types (debounced)
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      if (searchQuery.trim()) {
        updateSearchParams({ q: searchQuery, page: 1 });
      }
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery]);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/search/filters');
      if (response.ok) {
        const data = await response.json();
        setFilterOptions(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch filter options:', err);
    }
  };

  const updateSearchParams = (newParams) => {
    const current = Object.fromEntries(searchParams);
    const updated = { ...current, ...newParams };
    
    // Remove empty values
    Object.keys(updated).forEach(key => {
      if (!updated[key] || updated[key] === 'all' || updated[key] === '') {
        delete updated[key];
      }
    });
    
    setSearchParams(updated);
  };

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams(searchParams);
      const response = await fetch(`http://localhost:5000/api/search?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setSearchResults(data.data.results);
      setPagination(data.data.pagination);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateSearchParams({
      q: searchQuery,
      category: selectedCategory,
      store: selectedStore,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      unit: selectedUnit,
      hasPromotion: hasPromotion.toString(),
      validDealsOnly: validDealsOnly.toString(),
      sortBy,
      page: 1
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStore('');
    setPriceRange({ min: '', max: '' });
    setSelectedUnit('all');
    setHasPromotion(false);
    setValidDealsOnly(false);
    setSortBy('relevance');
    setSearchParams({});
    setSearchResults([]);
  };

  const handlePageChange = (newPage) => {
    updateSearchParams({ page: newPage });
  };

  const formatPrice = (price) => {
    return price ? `$${price.toFixed(2)}` : '—';
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : '—';
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%',
      backgroundColor: '#f8f9fa',
      minHeight: 'calc(100vh - 60px)'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: '#333',
          marginBottom: '10px',
          fontSize: '2rem'
        }}>
          Search Grocery Items
        </h1>
        <p style={{ color: '#666' }}>
          Find the best deals on groceries from various stores
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        border: '1px solid #b8e0ff'
      }}>
        {/* Main Search Bar */}
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for items... (e.g., apples, milk, bread)"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #b8e0ff',
              borderRadius: '6px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.2s',
              backgroundColor: '#f0f8ff',
              color: '#333'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#b8e0ff'}
          />
        </div>

        {/* Filter Toggle */}
        <div style={{ marginBottom: '15px' }}>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: '8px 16px',
              backgroundColor: showFilters ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'} ({(() => {
              const params = Object.fromEntries(searchParams);
              const filterParams = Object.keys(params).filter(key => {
                if (key === 'q' || key === 'page') return false;
                const value = params[key];
                if (!value || value === 'all' || value === '' || value === 'false' || value === 'relevance') return false;
                return true;
              });
              return filterParams.length;
            })()})
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '15px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px'
          }}>
            {/* Category Filter */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Category:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={selectStyle}
              >
                <option value="all">All Categories</option>
                {filterOptions.categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Store Filter */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Store:
              </label>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                style={selectStyle}
              >
                <option value="">All Stores</option>
                {filterOptions.stores.map(store => (
                  <option key={store} value={store}>{store}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Price Range:
              </label>
              <div style={{ display: 'flex', gap: '5px' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  style={{ ...inputStyle, width: '50%' }}
                  min="0"
                  step="0.01"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  style={{ ...inputStyle, width: '50%' }}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Unit Filter */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Unit:
              </label>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                style={selectStyle}
              >
                <option value="all">All Units</option>
                {filterOptions.units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Sort By:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={selectStyle}
              >
                <option value="relevance">Relevance</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
                <option value="store">Store</option>
                <option value="category">Category</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  checked={hasPromotion}
                  onChange={(e) => setHasPromotion(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Items with promotions only
              </label>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={validDealsOnly}
                  onChange={(e) => setValidDealsOnly(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Valid deals only
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            onClick={clearFilters}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Clear All
          </button>
        </div>
      </form>

      {/* Results Section */}
      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {pagination && (
        <div style={{
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#e9ecef',
          borderRadius: '4px',
          fontSize: '14px',
          color: '#6c757d'
        }}>
          Showing {searchResults.length} of {pagination.totalItems} results
          {searchQuery && ` for "${searchQuery}"`}
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          {'\u00A0'}(Page {pagination.currentPage} of {pagination.totalPages})
        </div>
      )}

      {loading && searchResults.length === 0 ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px'
        }}>
          <div style={{ textAlign: 'center', color: '#666' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 10px'
            }}></div>
            Searching...
          </div>
        </div>
      ) : searchResults.length > 0 ? (
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
                {searchResults.map((item) => (
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
            {searchResults.map((item) => (
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

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              marginTop: '30px',
              padding: '20px'
            }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                style={{
                  padding: '8px 16px',
                  backgroundColor: pagination.hasPrevPage ? '#007bff' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: pagination.hasPrevPage ? 'pointer' : 'not-allowed'
                }}
              >
                Previous
              </button>
              
              <span style={{ margin: '0 15px', color: '#666' }}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                style={{
                  padding: '8px 16px',
                  backgroundColor: pagination.hasNextPage ? '#007bff' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed'
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : searchParams.toString() && !loading ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666'
        }}>
          <h3 style={{ marginBottom: '10px' }}>No results found</h3>
          <p>Try adjusting your search terms or filters</p>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666'
        }}>
          <h3 style={{ marginBottom: '10px' }}>Start your search</h3>
          <p>Enter a search term above to find grocery items</p>
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

const selectStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #ced4da',
  borderRadius: '4px',
  fontSize: '14px',
  backgroundColor: 'white',
  color: '#495057'
};

const inputStyle = {
  padding: '8px 12px',
  border: '1px solid #ced4da',
  borderRadius: '4px',
  fontSize: '14px',
  backgroundColor: 'white',
  color: '#495057'
};

export default SearchPage;
