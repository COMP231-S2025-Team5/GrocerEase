import express from 'express';
import GroceryItem from '../models/GroceryItem.js';
import {
  buildTextQuery,
  buildPriceQuery,
  buildCategoryQuery,
  buildStoreQuery,
  buildUnitQuery,
  buildPromotionQuery,
  buildDateRangeQuery,
  combineFilters,
  buildPagination,
  buildSortQuery,
  applyPreset
} from '../utils/searchFilters.js';
import {
  validateSearchFilters,
  logSearchQuery,
  addDefaultFilters,
  handleSearchErrors,
  cacheFilterOptions,
  rateLimitSearch
} from '../middleware/searchMiddleware.js';

const router = express.Router();

// Main search route with comprehensive filtering
router.get('/', 
  rateLimitSearch,
  addDefaultFilters, 
  validateSearchFilters, 
  logSearchQuery, 
  async (req, res) => {
  try {
    const {
      q,              // Text search query
      category,       // Category filter
      minPrice,       // Minimum price
      maxPrice,       // Maximum price
      store,          // Store name filter
      unit,           // Unit type filter
      hasPromotion,   // Has promotion filter
      validDealsOnly, // Valid deals only
      includeInactive,// Include inactive items
      sortBy,         // Sort field
      sortOrder,      // Sort order (asc/desc)
      page = 1,       // Pagination - page number
      limit = 20      // Pagination - items per page
    } = req.query;

    // Build filter queries using utility functions
    const textQuery = buildTextQuery(q);
    const priceQuery = buildPriceQuery(minPrice, maxPrice);
    const categoryQuery = buildCategoryQuery(category);
    const storeQuery = buildStoreQuery(store);
    const unitQuery = buildUnitQuery(unit);
    const promotionQuery = buildPromotionQuery(hasPromotion, validDealsOnly);
    
    // Active items filter
    const activeQuery = includeInactive === 'true' ? {} : { isActive: true };

    // Combine all filters
    const filterQuery = combineFilters(
      textQuery,
      priceQuery,
      categoryQuery,
      storeQuery,
      unitQuery,
      promotionQuery,
      activeQuery
    );

    // Build sort options
    const sortOptions = buildSortQuery(sortBy, sortOrder);

    // Calculate pagination
    const pagination = buildPagination(page, limit);

    // Execute search query
    const searchQuery = GroceryItem.find(filterQuery);

    // Add text score for relevance sorting if text search is used
    if (q && q.trim() !== '') {
      searchQuery.select({ score: { $meta: 'textScore' } });
    }

    const [results, totalCount] = await Promise.all([
      searchQuery
        .sort(sortOptions)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      GroceryItem.countDocuments(filterQuery)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / pagination.limit);

    // Get available filter options (for frontend dropdowns)
    const [categories, stores, units] = await Promise.all([
      GroceryItem.distinct('category'),
      GroceryItem.distinct('store.name'),
      GroceryItem.distinct('unitDetails.unit')
    ]);

    // Response with results and metadata
    res.json({
      success: true,
      message: 'Search completed successfully',
      data: {
        results,
        pagination: {
          currentPage: pagination.page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: pagination.limit,
          hasNextPage: pagination.page < totalPages,
          hasPrevPage: pagination.page > 1
        },
        appliedFilters: {
          query: q || '',
          category: category || 'all',
          priceRange: {
            min: minPrice || null,
            max: maxPrice || null
          },
          store: store || '',
          unit: unit || 'all',
          hasPromotion: hasPromotion === 'true',
          validDealsOnly: validDealsOnly === 'true',
          includeInactive: includeInactive === 'true',
          sortBy: sortBy || 'relevance',
          sortOrder: sortOrder || 'asc'
        },
        availableFilters: {
          categories: categories.sort(),
          stores: stores.sort(),
          units: units.sort()
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error during search',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Get filter options endpoint (for populating frontend dropdowns)
router.get('/filters', cacheFilterOptions, async (req, res) => {
  try {
    const [categories, stores, units, priceRange] = await Promise.all([
      GroceryItem.distinct('category'),
      GroceryItem.distinct('store.name'),
      GroceryItem.distinct('unitDetails.unit'),
      GroceryItem.aggregate([
        { $match: { isActive: true } },
        { $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }}
      ])
    ]);

    const responseData = {
      categories: categories.sort(),
      stores: stores.sort(),
      units: units.sort(),
      priceRange: priceRange[0] || { minPrice: 0, maxPrice: 100 },
      sortOptions: [
        { value: 'relevance', label: 'Relevance' },
        { value: 'price', label: 'Price' },
        { value: 'name', label: 'Name' },
        { value: 'store', label: 'Store' },
        { value: 'category', label: 'Category' },
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' }
      ]
    };

    // Update cache
    global.filterOptionsCache = {
      data: responseData,
      timestamp: Date.now(),
      ttl: 5 * 60 * 1000 // 5 minutes
    };

    res.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Advanced search route for more complex filtering
router.post('/advanced', async (req, res) => {
  try {
    const {
      textFilters = {},     // { itemName, storeName, promotion }
      priceFilters = {},    // { min, max, hasPromotion }
      locationFilters = {}, // { stores: [], locations: [] }
      categoryFilters = {}, // { categories: [], includeOther: false }
      unitFilters = {},     // { units: [], quantityRange: {} }
      timeFilters = {},     // { dateRange: {}, validDealsOnly: false }
      sortOptions = {},     // { sortBy, sortOrder, secondarySort }
      pagination = {}       // { page, limit }
    } = req.body;

    const query = {};

    // Text-based filters
    if (textFilters.itemName) {
      query.itemName = { $regex: textFilters.itemName, $options: 'i' };
    }
    if (textFilters.storeName) {
      query['store.name'] = { $regex: textFilters.storeName, $options: 'i' };
    }
    if (textFilters.promotion) {
      query.promotion = { $regex: textFilters.promotion, $options: 'i' };
    }

    // Price filters
    if (priceFilters.min !== undefined || priceFilters.max !== undefined) {
      query.price = {};
      if (priceFilters.min !== undefined) query.price.$gte = priceFilters.min;
      if (priceFilters.max !== undefined) query.price.$lte = priceFilters.max;
    }
    if (priceFilters.hasPromotion) {
      query.promotion = { $ne: null, $ne: '' };
    }

    // Location filters
    if (locationFilters.stores && locationFilters.stores.length > 0) {
      query['store.name'] = { $in: locationFilters.stores };
    }
    if (locationFilters.locations && locationFilters.locations.length > 0) {
      query['store.location'] = { $in: locationFilters.locations };
    }

    // Category filters
    if (categoryFilters.categories && categoryFilters.categories.length > 0) {
      if (categoryFilters.includeOther) {
        query.category = { $in: [...categoryFilters.categories, 'other'] };
      } else {
        query.category = { $in: categoryFilters.categories };
      }
    }

    // Unit filters
    if (unitFilters.units && unitFilters.units.length > 0) {
      query['unitDetails.unit'] = { $in: unitFilters.units };
    }
    if (unitFilters.quantityRange) {
      if (unitFilters.quantityRange.min !== undefined || unitFilters.quantityRange.max !== undefined) {
        query['unitDetails.quantity'] = {};
        if (unitFilters.quantityRange.min !== undefined) {
          query['unitDetails.quantity'].$gte = unitFilters.quantityRange.min;
        }
        if (unitFilters.quantityRange.max !== undefined) {
          query['unitDetails.quantity'].$lte = unitFilters.quantityRange.max;
        }
      }
    }

    // Time-based filters
    if (timeFilters.dateRange) {
      if (timeFilters.dateRange.start || timeFilters.dateRange.end) {
        query.createdAt = {};
        if (timeFilters.dateRange.start) {
          query.createdAt.$gte = new Date(timeFilters.dateRange.start);
        }
        if (timeFilters.dateRange.end) {
          query.createdAt.$lte = new Date(timeFilters.dateRange.end);
        }
      }
    }
    if (timeFilters.validDealsOnly) {
      query.dealValidUntil = { $gte: new Date() };
    }

    // Always include active items only unless specified
    query.isActive = true;

    // Build sort options
    let sortObj = {};
    if (sortOptions.sortBy) {
      const order = sortOptions.sortOrder === 'desc' ? -1 : 1;
      switch (sortOptions.sortBy) {
        case 'price':
          sortObj.price = order;
          break;
        case 'name':
          sortObj.itemName = order;
          break;
        case 'store':
          sortObj['store.name'] = order;
          break;
        case 'category':
          sortObj.category = order;
          break;
        case 'date':
          sortObj.createdAt = order;
          break;
        default:
          sortObj.createdAt = -1; // Default to newest first
      }
    } else {
      sortObj.createdAt = -1;
    }

    // Secondary sort
    if (sortOptions.secondarySort && sortOptions.secondarySort !== sortOptions.sortBy) {
      const secondaryOrder = sortOptions.secondarySortOrder === 'desc' ? -1 : 1;
      sortObj[sortOptions.secondarySort] = secondaryOrder;
    }

    // Pagination
    const page = parseInt(pagination.page) || 1;
    const limit = parseInt(pagination.limit) || 20;
    const skip = (page - 1) * limit;

    // Execute query
    const [results, totalCount] = await Promise.all([
      GroceryItem.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      GroceryItem.countDocuments(query)
    ]);

    res.json({
      success: true,
      message: 'Advanced search completed',
      data: {
        results,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
          itemsPerPage: limit
        },
        appliedQuery: query,
        appliedSort: sortObj
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in advanced search',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Quick filter presets for common searches
router.get('/presets/:presetName', async (req, res) => {
  try {
    const { presetName } = req.params;
    const { page = 1, limit = 20 } = req.query;

    let query = { isActive: true };
    let sort = { createdAt: -1 };

    switch (presetName) {
      case 'deals':
        query.promotion = { $ne: null, $ne: '' };
        query.dealValidUntil = { $gte: new Date() };
        sort = { price: 1 }; // Cheapest first
        break;
      
      case 'fresh-produce':
        query.category = { $in: ['fruits', 'vegetables'] };
        sort = { createdAt: -1 }; // Newest first
        break;
      
      case 'budget-friendly':
        query.price = { $lte: 10 }; // Items under $10
        sort = { price: 1 };
        break;
      
      case 'premium':
        query.price = { $gte: 50 }; // Items $50 and above
        sort = { price: -1 }; // Most expensive first
        break;
      
      case 'bulk-items':
        query['unitDetails.unit'] = { $in: ['pack', 'box', 'bag'] };
        sort = { 'unitDetails.pricePerUnit': 1 };
        break;
      
      default:
        return res.status(400).json({
          success: false,
          message: `Unknown preset: ${presetName}`,
          availablePresets: ['deals', 'fresh-produce', 'budget-friendly', 'premium', 'bulk-items']
        });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [results, totalCount] = await Promise.all([
      GroceryItem.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      GroceryItem.countDocuments(query)
    ]);

    res.json({
      success: true,
      message: `${presetName} preset search completed`,
      data: {
        preset: presetName,
        results,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalCount / limitNum),
          totalItems: totalCount,
          itemsPerPage: limitNum
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in preset search',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Search suggestions endpoint (for autocomplete)
router.get('/suggestions', async (req, res) => {
  try {
    const { q, type = 'all', limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: {
          items: [],
          stores: [],
          categories: []
        }
      });
    }

    const searchRegex = { $regex: q.trim(), $options: 'i' };
    const limitNum = parseInt(limit) || 10;

    const suggestions = {};

    if (type === 'all' || type === 'items') {
      suggestions.items = await GroceryItem.distinct('itemName', {
        itemName: searchRegex,
        isActive: true
      }).limit(limitNum);
    }

    if (type === 'all' || type === 'stores') {
      suggestions.stores = await GroceryItem.distinct('store.name', {
        'store.name': searchRegex,
        isActive: true
      }).limit(limitNum);
    }

    if (type === 'all' || type === 'categories') {
      const allCategories = ['fruits', 'vegetables', 'meat', 'dairy', 'bakery', 'pantry', 'frozen', 'beverages', 'snacks', 'household', 'personal-care', 'other'];
      suggestions.categories = allCategories.filter(cat => 
        cat.toLowerCase().includes(q.toLowerCase())
      ).slice(0, limitNum);
    }

    res.json({
      success: true,
      data: suggestions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching suggestions',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Add error handling middleware
router.use(handleSearchErrors);

export default router;
