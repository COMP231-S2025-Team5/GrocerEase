# Search API Documentation

## Overview
The search system now supports both keyword-based searches and filter-only browsing. You can search with keywords, apply filters without keywords, or browse items by store/category directly.

## Endpoints

### 1. Main Search Endpoint
`GET /api/search`

**Description**: Search and filter grocery items with comprehensive options.

**Query Parameters**:
- `q` (string, optional): Search keyword/phrase
- `category` (string, optional): Filter by category
- `minPrice` (number, optional): Minimum price filter
- `maxPrice` (number, optional): Maximum price filter  
- `store` (string, optional): Filter by store name
- `unit` (string, optional): Filter by unit type
- `hasPromotion` (boolean, optional): Filter items with promotions
- `validDealsOnly` (boolean, optional): Filter only valid deals
- `includeInactive` (boolean, optional): Include inactive items
- `sortBy` (string, optional): Sort field (name, price, store, category, newest, oldest, relevance)
- `sortOrder` (string, optional): Sort order (asc, desc)
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20, max: 100)

**New Behavior**:
- ✅ **Filter without keywords**: You can now apply filters (store, category, price, etc.) without providing a search keyword
- ✅ **Smart sorting**: When no keyword is provided, sorting defaults to 'name' instead of 'relevance'
- ✅ **Empty prevention**: Returns empty results if neither keywords nor filters are provided

**Examples**:

```bash
# Search with keyword only
GET /api/search?q=apple

# Filter by store only (no keyword required)
GET /api/search?store=Walmart

# Filter by category only
GET /api/search?category=fruits

# Combine filters without keyword
GET /api/search?store=Metro&category=vegetables&minPrice=1&maxPrice=10

# Search with keyword AND filters
GET /api/search?q=organic&store=Loblaws&category=fruits
```

### 2. Browse by Store
`GET /api/search/browse/store/:storeName`

**Description**: Browse all items from a specific store with optional additional filters.

**Path Parameters**:
- `storeName` (string): Name of the store to browse

**Query Parameters**:
- `category`, `minPrice`, `maxPrice`, `unit`, `hasPromotion`, `validDealsOnly`, `includeInactive`, `sortBy`, `sortOrder`, `page`, `limit`

**Examples**:
```bash
# Browse all items from Walmart
GET /api/search/browse/store/Walmart

# Browse fruits from Metro with price filter
GET /api/search/browse/store/Metro?category=fruits&maxPrice=5

# Browse vegetables from Loblaws, sorted by price
GET /api/search/browse/store/Loblaws?category=vegetables&sortBy=price&sortOrder=asc
```

### 3. Browse by Category
`GET /api/search/browse/category/:categoryName`

**Description**: Browse all items in a specific category with optional additional filters.

**Path Parameters**:
- `categoryName` (string): Name of the category to browse

**Query Parameters**:
- `store`, `minPrice`, `maxPrice`, `unit`, `hasPromotion`, `validDealsOnly`, `includeInactive`, `sortBy`, `sortOrder`, `page`, `limit`

**Examples**:
```bash
# Browse all fruits
GET /api/search/browse/category/fruits

# Browse dairy products from specific store
GET /api/search/browse/category/dairy?store=Metro

# Browse vegetables under $3
GET /api/search/browse/category/vegetables?maxPrice=3
```

### 4. Get Filter Options
`GET /api/search/filters`

**Description**: Get available filter options for frontend dropdowns.

**Response includes**:
- Available categories
- Available stores  
- Available units
- Price range (min/max)
- Sort options

### 5. Search Suggestions
`GET /api/search/suggestions`

**Query Parameters**:
- `q` (string): Partial search term
- `type` (string): Type of suggestions (all, items, stores, categories)
- `limit` (number): Max suggestions to return

### 6. Preset Searches
`GET /api/search/presets/:presetName`

**Available Presets**:
- `deals`: Items with active promotions
- `fresh-produce`: Fresh fruits and vegetables
- `budget-friendly`: Items under $5
- `premium`: High-quality/expensive items
- `bulk-items`: Items sold in bulk quantities

## Response Format

All endpoints return a consistent response format:

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
    "appliedFilters": {
      "query": "",
      "category": "fruits",
      "store": "Walmart",
      "priceRange": { "min": null, "max": 10 },
      "sortBy": "name",
      "sortOrder": "asc"
    },
    "availableFilters": {
      "categories": ["fruits", "vegetables", ...],
      "stores": ["Walmart", "Metro", ...],
      "units": ["lb", "kg", "piece", ...]
    }
  }
}
```

## Frontend Usage Examples

### React Component Example
```javascript
// Browse store without keyword
const browseStore = async (storeName) => {
  const response = await fetch(`/api/search?store=${encodeURIComponent(storeName)}`);
  const data = await response.json();
  return data.data.results;
};

// Browse with multiple filters
const browseWithFilters = async (filters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  
  const response = await fetch(`/api/search?${params}`);
  const data = await response.json();
  return data.data.results;
};

// Usage:
browseStore("Walmart"); // All Walmart items
browseWithFilters({ 
  store: "Metro", 
  category: "fruits", 
  maxPrice: 5 
}); // Metro fruits under $5
```

## Migration Notes

**Breaking Changes**: None - all existing functionality is preserved.

**New Features**:
1. ✅ Filter-only searches (no keyword required)
2. ✅ Direct store/category browsing endpoints
3. ✅ Smart default sorting for non-text searches
4. ✅ Improved empty state handling

**Recommended Updates**:
- Update frontend to support filter-only searches
- Add store/category browsing pages using new endpoints
- Update UI to indicate when filters are applied without keywords
