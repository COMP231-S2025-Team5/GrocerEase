# GrocerEase Search Filter Documentation

## Overview
This document describes the comprehensive search and filter functionality implemented for the GrocerEase project using an agile development approach.

## Filter Features

### 1. Text Search
- **Endpoint**: `GET /api/search?q=searchterm`
- **Description**: Full-text search across item names and store names
- **Example**: `/api/search?q=apple juice`

### 2. Category Filter
- **Parameter**: `category`
- **Values**: fruits, vegetables, meat, dairy, bakery, pantry, frozen, beverages, snacks, household, personal-care, other
- **Example**: `/api/search?category=fruits`

### 3. Price Range Filter
- **Parameters**: `minPrice`, `maxPrice`
- **Description**: Filter items within specified price range
- **Example**: `/api/search?minPrice=5&maxPrice=20`

### 4. Store Filter
- **Parameter**: `store`
- **Description**: Filter by store name (partial match supported)
- **Example**: `/api/search?store=walmart`

### 5. Unit Type Filter
- **Parameter**: `unit`
- **Values**: lb, oz, kg, g, item, each, pack, bottle, can, box, bag
- **Example**: `/api/search?unit=bottle`

### 6. Promotion Filters
- **Parameters**: 
  - `hasPromotion=true` - Items with promotions
  - `validDealsOnly=true` - Only valid deals
- **Example**: `/api/search?hasPromotion=true&validDealsOnly=true`

### 7. Active Items Filter
- **Parameter**: `includeInactive`
- **Default**: false (only active items)
- **Example**: `/api/search?includeInactive=true`

## Sorting Options

### Sort Parameters
- **Parameter**: `sortBy`
- **Values**: relevance, price, name, store, category, newest, oldest
- **Order Parameter**: `sortOrder` (asc/desc)
- **Example**: `/api/search?sortBy=price&sortOrder=asc`

## Pagination

### Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- **Example**: `/api/search?page=2&limit=10`

## API Endpoints

### 1. Main Search
```
GET /api/search
```
**Query Parameters:**
- q: Search term
- category: Category filter
- minPrice: Minimum price
- maxPrice: Maximum price
- store: Store name
- unit: Unit type
- hasPromotion: Boolean for promotion filter
- validDealsOnly: Boolean for valid deals
- includeInactive: Include inactive items
- sortBy: Sort field
- sortOrder: Sort direction
- page: Page number
- limit: Items per page

**Response:**
```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": {
    "results": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "itemsPerPage": 20,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "appliedFilters": {...},
    "availableFilters": {...}
  }
}
```

### 2. Filter Options
```
GET /api/search/filters
```
**Description**: Returns all available filter options for frontend dropdowns

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": ["fruits", "vegetables", ...],
    "stores": ["Walmart", "Metro", ...],
    "units": ["lb", "oz", "kg", ...],
    "priceRange": { "minPrice": 0.5, "maxPrice": 199.99 },
    "sortOptions": [...]
  }
}
```

### 3. Advanced Search
```
POST /api/search/advanced
```
**Description**: Complex filtering with multiple criteria

**Request Body:**
```json
{
  "textFilters": {
    "itemName": "chicken",
    "storeName": "metro",
    "promotion": "sale"
  },
  "priceFilters": {
    "min": 5,
    "max": 30,
    "hasPromotion": true
  },
  "categoryFilters": {
    "categories": ["meat", "frozen"],
    "includeOther": false
  },
  "locationFilters": {
    "stores": ["Metro", "Walmart"],
    "locations": ["Downtown", "Mall"]
  },
  "unitFilters": {
    "units": ["lb", "kg"],
    "quantityRange": { "min": 1, "max": 5 }
  },
  "timeFilters": {
    "dateRange": {
      "start": "2025-01-01",
      "end": "2025-12-31"
    },
    "validDealsOnly": true
  },
  "sortOptions": {
    "sortBy": "price",
    "sortOrder": "asc",
    "secondarySort": "name"
  },
  "pagination": {
    "page": 1,
    "limit": 20
  }
}
```

### 4. Search Presets
```
GET /api/search/presets/:presetName
```
**Available Presets:**
- `deals` - Items with promotions, sorted by price
- `fresh-produce` - Fruits and vegetables, newest first
- `budget-friendly` - Items under $10, cheapest first
- `premium` - Items $50+, most expensive first
- `bulk-items` - Pack/box/bag items, sorted by price per unit

**Example**: `/api/search/presets/deals?page=1&limit=10`

### 5. Search Suggestions
```
GET /api/search/suggestions
```
**Parameters:**
- q: Search term (minimum 2 characters)
- type: all, items, stores, categories
- limit: Number of suggestions (default: 10)

**Example**: `/api/search/suggestions?q=app&type=items&limit=5`

## Implementation Details

### File Structure
```
server/
├── routes/
│   └── search.js           # Main search routes
├── utils/
│   └── searchFilters.js    # Filter utility functions
├── middleware/
│   └── searchMiddleware.js # Validation and logging
├── models/
│   └── GroceryItem.js      # Database model
└── examples/
    └── searchExamples.js   # Usage examples
```

### Key Features for Agile Development

1. **Modular Design**: Separated concerns into utilities, middleware, and routes
2. **Comprehensive Validation**: Input validation with meaningful error messages
3. **Logging**: Request and performance logging for debugging
4. **Caching**: Filter options caching for performance
5. **Rate Limiting**: Basic rate limiting protection
6. **Error Handling**: Graceful error handling with appropriate responses
7. **Extensibility**: Easy to add new filters and sorting options

### Database Indexes
The following indexes are created for optimal search performance:
- Text index on itemName and store.name
- Individual indexes on price, store.name, category, and createdAt

### Rate Limiting
- 100 requests per minute per IP
- Configurable window and limits
- Returns 429 status with retry information

### Caching
- Filter options cached for 5 minutes
- In-memory cache (can be extended to Redis in production)
- Cache invalidation on data updates

## Usage Examples

### Frontend Integration
```javascript
// Search with filters
const searchItems = async (filters) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`/api/search?${params}`);
  return response.json();
};

// Get filter options
const getFilterOptions = async () => {
  const response = await fetch('/api/search/filters');
  return response.json();
};

// Search suggestions
const getSuggestions = async (query) => {
  const response = await fetch(`/api/search/suggestions?q=${query}&limit=5`);
  return response.json();
};
```

### Testing Endpoints
Use the examples in `server/examples/searchExamples.js` for testing different filter combinations.

## Future Enhancements (Agile Ready)

1. **Geolocation Filters**: Filter by store proximity
2. **User Preferences**: Personalized filter defaults
3. **Advanced Analytics**: Search analytics and recommendations
4. **Bulk Operations**: Batch filtering operations
5. **Real-time Updates**: WebSocket for live filter updates
6. **AI-Powered Search**: Machine learning for better relevance

This filter system is designed to support incremental development and can be easily extended as new requirements emerge during the agile development process.
