/**
 * Test examples for GrocerEase Search Filter functionality
 * These examples show how to use the different filter endpoints
 */

// Example 1: Basic search with text query
// GET /api/search?q=apple&category=fruits&sortBy=price

// Example 2: Price range filter
// GET /api/search?minPrice=5&maxPrice=20&sortBy=price&sortOrder=asc

// Example 3: Store filter
// GET /api/search?store=walmart&hasPromotion=true

// Example 4: Multiple filters combined
// GET /api/search?q=milk&category=dairy&minPrice=2&maxPrice=10&store=superstore&unit=bottle&sortBy=price

// Example 5: Pagination
// GET /api/search?q=bread&page=2&limit=10

// Example 6: Get all available filter options
// GET /api/search/filters

// Example 7: Search suggestions (autocomplete)
// GET /api/search/suggestions?q=app&type=items&limit=5

// Example 8: Preset searches
// GET /api/search/presets/deals
// GET /api/search/presets/fresh-produce
// GET /api/search/presets/budget-friendly

// Example 9: Advanced search with POST
const advancedSearchExample = {
  textFilters: {
    itemName: "chicken",
    storeName: "metro"
  },
  priceFilters: {
    min: 5,
    max: 30,
    hasPromotion: true
  },
  categoryFilters: {
    categories: ["meat", "frozen"]
  },
  sortOptions: {
    sortBy: "price",
    sortOrder: "asc"
  },
  pagination: {
    page: 1,
    limit: 20
  }
};
// POST /api/search/advanced with above JSON body

console.log('Filter functionality examples loaded. Ready for agile development!');

export {
  advancedSearchExample
};
