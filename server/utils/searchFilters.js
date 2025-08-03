/**
 * Utility functions for search filtering
 * Supports agile development by providing reusable filter components
 */

// Price range validation and parsing
export const parsePrice = (priceString) => {
  if (!priceString) return undefined;
  const price = parseFloat(priceString);
  return !isNaN(price) && price >= 0 ? price : undefined;
};

// Build price range query
export const buildPriceQuery = (minPrice, maxPrice) => {
  const min = parsePrice(minPrice);
  const max = parsePrice(maxPrice);
  
  if (min === undefined && max === undefined) return {};
  
  const priceQuery = {};
  if (min !== undefined) priceQuery.$gte = min;
  if (max !== undefined) priceQuery.$lte = max;
  
  return { price: priceQuery };
};

// Build text search query
export const buildTextQuery = (searchText) => {
  if (!searchText || !searchText.trim()) return {};
  
  const cleanText = searchText.trim();
  
  // For MongoDB text index search
  if (cleanText.length > 2) {
    return { $text: { $search: cleanText } };
  }
  
  // For partial matches when text is too short for full-text search
  return {
    $or: [
      { itemName: { $regex: cleanText, $options: 'i' } },
      { 'store.name': { $regex: cleanText, $options: 'i' } }
    ]
  };
};

// Build category filter
export const buildCategoryQuery = (categories) => {
  if (!categories || categories === 'all') return {};
  
  if (Array.isArray(categories)) {
    return categories.length > 0 ? { category: { $in: categories } } : {};
  }
  
  return { category: categories };
};

// Build store filter
export const buildStoreQuery = (stores) => {
  if (!stores) return {};
  
  if (Array.isArray(stores)) {
    return stores.length > 0 ? { 'store.name': { $in: stores } } : {};
  }
  
  return { 'store.name': { $regex: stores, $options: 'i' } };
};

// Build unit filter
export const buildUnitQuery = (units) => {
  if (!units || units === 'all') return {};
  
  if (Array.isArray(units)) {
    return units.length > 0 ? { 'unitDetails.unit': { $in: units } } : {};
  }
  
  return { 'unitDetails.unit': units };
};

// Build promotion filter
export const buildPromotionQuery = (hasPromotion, validDealsOnly = false) => {
  const query = {};
  
  if (hasPromotion === true || hasPromotion === 'true') {
    query.promotion = { $ne: null, $ne: '' };
  }
  
  if (validDealsOnly === true || validDealsOnly === 'true') {
    query.dealValidUntil = { $gte: new Date() };
  }
  
  return query;
};

// Build date range filter
export const buildDateRangeQuery = (startDate, endDate) => {
  if (!startDate && !endDate) return {};
  
  const dateQuery = {};
  if (startDate) dateQuery.$gte = new Date(startDate);
  if (endDate) dateQuery.$lte = new Date(endDate);
  
  return Object.keys(dateQuery).length > 0 ? { createdAt: dateQuery } : {};
};

// Combine multiple filter queries
export const combineFilters = (...filters) => {
  const combined = {};
  
  filters.forEach(filter => {
    if (filter && typeof filter === 'object') {
      Object.assign(combined, filter);
    }
  });
  
  return combined;
};

// Pagination helpers
export const buildPagination = (page, limit) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = Math.min(parseInt(limit) || 20, 100); // Max 100 items per page
  const skip = (pageNum - 1) * limitNum;
  
  return {
    page: pageNum,
    limit: limitNum,
    skip
  };
};

// Sort options builder
export const buildSortQuery = (sortBy, sortOrder = 'asc') => {
  const order = sortOrder === 'desc' ? -1 : 1;
  
  const sortMappings = {
    price: { price: order },
    name: { itemName: order },
    store: { 'store.name': order },
    category: { category: order },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    relevance: { score: { $meta: 'textScore' } },
    'price-per-unit': { 'unitDetails.pricePerUnit': order }
  };
  
  return sortMappings[sortBy] || { createdAt: -1 };
};

// Filter validation
export const validateFilters = (filters) => {
  const errors = [];
  
  // Validate price range
  if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
    const min = parsePrice(filters.minPrice);
    const max = parsePrice(filters.maxPrice);
    
    if (min !== undefined && max !== undefined && min > max) {
      errors.push('Minimum price cannot be greater than maximum price');
    }
  }
  
  // Validate pagination
  if (filters.page && parseInt(filters.page) < 1) {
    errors.push('Page number must be greater than 0');
  }
  
  if (filters.limit && (parseInt(filters.limit) < 1 || parseInt(filters.limit) > 100)) {
    errors.push('Limit must be between 1 and 100');
  }
  
  // Validate date range
  if (filters.startDate && filters.endDate) {
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    
    if (start > end) {
      errors.push('Start date cannot be after end date');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Common filter presets
export const filterPresets = {
  deals: {
    hasPromotion: true,
    validDealsOnly: true,
    sortBy: 'price',
    sortOrder: 'asc'
  },
  
  freshProduce: {
    category: ['fruits', 'vegetables'],
    sortBy: 'newest'
  },
  
  budgetFriendly: {
    maxPrice: 10,
    sortBy: 'price',
    sortOrder: 'asc'
  },
  
  premium: {
    minPrice: 50,
    sortBy: 'price',
    sortOrder: 'desc'
  },
  
  bulkItems: {
    unit: ['pack', 'box', 'bag'],
    sortBy: 'price-per-unit'
  }
};

// Apply preset filters
export const applyPreset = (presetName, additionalFilters = {}) => {
  const preset = filterPresets[presetName];
  if (!preset) {
    throw new Error(`Unknown preset: ${presetName}`);
  }
  
  return { ...preset, ...additionalFilters };
};
