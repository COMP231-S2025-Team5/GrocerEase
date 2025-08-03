# GrocerEase Server

Backend server for the GrocerEase application built with Node.js, Express, and MongoDB.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env` file and update the values as needed
   - Make sure to change the JWT_SECRET in production

4. Start MongoDB (if running locally):
   ```bash
   mongod
   ```

5. Run the server:
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## Project Structure

```
server/
├── routes/              # API routes
│   ├── auth.js         # Authentication routes
│   ├── items.js        # Item management routes
│   └── search.js       # Search and filter routes (NEW)
├── middleware/          # Custom middleware
│   ├── auth.js         # Authentication middleware
│   └── searchMiddleware.js # Search validation & logging (NEW)
├── models/             # MongoDB models
│   ├── User.js         # User model
│   ├── GroceryItem.js  # Grocery item model
│   └── Report.js       # Report model
├── utils/              # Utility functions
│   └── searchFilters.js # Filter utility functions (NEW)
├── scripts/            # Database scripts
│   └── loadSampleData.js # Sample data loader (NEW)
├── examples/           # Usage examples
│   └── searchExamples.js # Search API examples (NEW)
├── .env               # Environment variables
├── package.json       # Dependencies and scripts
├── server.js          # Main server file
├── testsearch.http    # HTTP test file for search endpoints (NEW)
├── README.md          # This file
└── FILTER_README.md   # Detailed search filter documentation (NEW)
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `CLIENT_URL` - Frontend URL for CORS
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

## Search Filter Functionality

The GrocerEase server includes comprehensive search and filter functionality designed for agile development. This system allows users to search and filter grocery items with multiple criteria.

### Key Features

✅ **Text Search** - Full-text search across item names and store names  
✅ **Category Filtering** - Filter by product categories (fruits, vegetables, meat, etc.)  
✅ **Price Range** - Min/max price filtering  
✅ **Store Filtering** - Filter by store name  
✅ **Unit Type** - Filter by unit types (lb, kg, pack, bottle, etc.)  
✅ **Promotion Filters** - Find items with deals and valid promotions  
✅ **Sorting Options** - Sort by price, name, relevance, date, etc.  
✅ **Pagination** - Page-based results with metadata  
✅ **Rate Limiting** - Built-in protection against abuse  
✅ **Caching** - Performance optimization for filter options  

### API Endpoints

#### 1. Main Search
```
GET /api/search
```
**Query Parameters:**
- `q` - Search term (e.g., "apple juice")
- `category` - Product category (fruits, vegetables, meat, dairy, etc.)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `store` - Store name filter
- `unit` - Unit type (lb, oz, kg, pack, bottle, etc.)
- `hasPromotion` - true/false for promotion filter
- `validDealsOnly` - true/false for valid deals only
- `sortBy` - Sort field (price, name, relevance, newest, etc.)
- `sortOrder` - asc/desc
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

**Example:**
```
GET /api/search?q=milk&category=dairy&minPrice=2&maxPrice=10&sortBy=price
```

#### 2. Filter Options
```
GET /api/search/filters
```
Returns available filter options for frontend dropdowns (categories, stores, units, price ranges).

#### 3. Search Presets
```
GET /api/search/presets/:presetName
```
**Available Presets:**
- `deals` - Items with promotions, sorted by price
- `fresh-produce` - Fruits and vegetables, newest first
- `budget-friendly` - Items under $10, cheapest first
- `premium` - Items $50+, most expensive first
- `bulk-items` - Pack/box/bag items, sorted by price per unit

**Example:**
```
GET /api/search/presets/deals?page=1&limit=10
```

#### 4. Advanced Search
```
POST /api/search/advanced
```
Complex filtering with JSON body for multiple criteria combinations.

#### 5. Search Suggestions
```
GET /api/search/suggestions?q=app&limit=5
```
Autocomplete suggestions for search terms.

### Testing the Search Functionality

1. **Start the server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Load sample data** (optional):
   ```bash
   node scripts/loadSampleData.js
   ```

3. **Test endpoints** using the provided `testsearch.http` file in VS Code REST Client or any HTTP client:
   ```http
   GET http://localhost:5000/api/search/presets/deals
   GET http://localhost:5000/api/search?q=apple
   GET http://localhost:5000/api/search/filters
   ```

### File Structure for Search Functionality

```
server/
├── routes/
│   └── search.js           # Main search routes and endpoints
├── utils/
│   └── searchFilters.js    # Reusable filter utility functions
├── middleware/
│   └── searchMiddleware.js # Validation, logging, rate limiting
├── models/
│   └── GroceryItem.js      # Database model with search indexes
├── scripts/
│   └── loadSampleData.js   # Sample data for testing
├── examples/
│   └── searchExamples.js   # Usage examples
├── testsearch.http         # HTTP test file for VS Code
└── FILTER_README.md        # Detailed filter documentation
```

### Database Indexes

The following MongoDB indexes are automatically created for optimal search performance:
- Text index on `itemName` and `store.name` for full-text search
- Individual indexes on `price`, `category`, `store.name`, and `createdAt`

### Agile Development Features

This search system is designed to support agile development:

1. **Modular Architecture** - Separated utilities, middleware, and routes
2. **Comprehensive Validation** - Input validation with meaningful error messages
3. **Logging & Debugging** - Request logging and performance tracking
4. **Error Handling** - Graceful error responses with proper status codes
5. **Extensibility** - Easy to add new filters and sorting options
6. **Testing Support** - Ready-to-use test cases and sample data
7. **Documentation** - Complete API documentation and examples

### Performance Considerations

- **Caching**: Filter options are cached for 5 minutes
- **Rate Limiting**: 100 requests per minute per IP
- **Pagination**: Maximum 100 items per page
- **Database Optimization**: Proper indexing for fast queries
- **Lean Queries**: Using `.lean()` for better performance

For detailed API documentation and advanced usage examples, see `FILTER_README.md`.
