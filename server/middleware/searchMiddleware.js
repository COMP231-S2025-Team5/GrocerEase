/**
 * Middleware for search filter validation and logging
 * Supports agile development with proper error handling and debugging
 */

import { validateFilters } from '../utils/searchFilters.js';

// Middleware to validate search filters
export const validateSearchFilters = (req, res, next) => {
  const validation = validateFilters(req.query);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Invalid filter parameters',
      errors: validation.errors
    });
  }
  
  next();
};

// Middleware to log search queries for analytics
export const logSearchQuery = (req, res, next) => {
  const startTime = Date.now();
  
  // Log the search query
  console.log(`[SEARCH] ${new Date().toISOString()} - Query:`, {
    path: req.path,
    query: req.query,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });
  
  // Override res.json to log response time
  const originalJson = res.json;
  res.json = function(data) {
    const responseTime = Date.now() - startTime;
    
    console.log(`[SEARCH] Response time: ${responseTime}ms - Results:`, {
      success: data.success,
      totalItems: data.data?.pagination?.totalItems || 0,
      resultsCount: data.data?.results?.length || 0,
      responseTime
    });
    
    return originalJson.call(this, data);
  };
  
  next();
};

// Middleware to add default filters for inactive development
export const addDefaultFilters = (req, res, next) => {
  // Ensure we only show active items by default
  if (req.query.includeInactive === undefined) {
    req.query.includeInactive = 'false';
  }
  
  // Set default pagination if not provided
  if (!req.query.page) {
    req.query.page = '1';
  }
  
  if (!req.query.limit) {
    req.query.limit = '20';
  }
  
  // Set default sort for text searches
  if (req.query.q && !req.query.sortBy) {
    req.query.sortBy = 'relevance';
  }
  
  next();
};

// Middleware to handle search errors gracefully
export const handleSearchErrors = (error, req, res, next) => {
  console.error('Search error:', {
    error: error.message,
    stack: error.stack,
    query: req.query,
    path: req.path
  });
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error in search parameters',
      error: error.message
    });
  }
  
  if (error.name === 'MongoError' || error.name === 'MongoServerError') {
    return res.status(500).json({
      success: false,
      message: 'Database error during search',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Database connection issue'
    });
  }
  
  // Generic error response
  res.status(500).json({
    success: false,
    message: 'Internal server error during search',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
};

// Middleware to cache filter options for better performance
export const cacheFilterOptions = (req, res, next) => {
  // Simple in-memory cache for filter options
  // In production, you might want to use Redis or similar
  if (!global.filterOptionsCache) {
    global.filterOptionsCache = {
      data: null,
      timestamp: null,
      ttl: 5 * 60 * 1000 // 5 minutes
    };
  }
  
  const now = Date.now();
  const cache = global.filterOptionsCache;
  
  // Check if cache is valid
  if (cache.data && cache.timestamp && (now - cache.timestamp) < cache.ttl) {
    return res.json({
      success: true,
      data: cache.data,
      cached: true
    });
  }
  
  // Continue to fetch fresh data
  next();
};

// Middleware to add rate limiting for search endpoints
export const rateLimitSearch = (req, res, next) => {
  // Simple rate limiting - in production use express-rate-limit
  if (!global.searchRateLimit) {
    global.searchRateLimit = new Map();
  }
  
  const clientId = req.ip || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100; // Max 100 requests per minute
  
  const clientData = global.searchRateLimit.get(clientId) || {
    requests: [],
    blocked: false
  };
  
  // Clean old requests
  clientData.requests = clientData.requests.filter(timestamp => 
    now - timestamp < windowMs
  );
  
  // Check if rate limit exceeded
  if (clientData.requests.length >= maxRequests) {
    return res.status(429).json({
      success: false,
      message: 'Too many search requests. Please try again later.',
      retryAfter: Math.ceil((windowMs - (now - clientData.requests[0])) / 1000)
    });
  }
  
  // Add current request
  clientData.requests.push(now);
  global.searchRateLimit.set(clientId, clientData);
  
  next();
};
