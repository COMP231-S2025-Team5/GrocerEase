# Employee Stock Management Feature

## Overview
This feature implements the "An employee can mark a product as out of stock" functionality as specified in requirements S11-1 through S11-6.

## Requirements Implementation

### ✅ S11-1: Can sort/filter products
- **Backend**: `/api/employee/products` endpoint with comprehensive filtering
- **Frontend**: Filter controls for search, category, stock status, and sorting
- **Features**: 
  - Text search across product names
  - Category filtering
  - Stock status filtering
  - Multiple sorting options (name, price, category, stock status, stock count)
  - Pagination support

### ✅ S11-2: Have a button to mark as out of stock
- **Frontend**: "Mark Out of Stock" button on each product card
- **Quick Action**: One-click button to immediately mark items as out of stock
- **Modal Interface**: Detailed stock update modal for more complex changes

### ✅ S11-3: Employee can select particular item
- **Frontend**: "Update Stock" button for each product
- **Product Selection**: Modal interface for detailed stock management
- **Product Details**: View current stock status, count, and history

### ✅ S11-4: Change is saved to database
- **Backend**: PATCH `/api/employee/products/:id/stock-status` endpoint
- **Database Updates**: Real-time stock status and count updates
- **Audit Trail**: Complete logging of who made changes, when, and why
- **Data Validation**: Server-side validation of stock status values

### ✅ S11-5: Design handler for success or failure
- **Success Messages**: Clear confirmation when updates succeed
- **Error Handling**: Detailed error messages for various failure scenarios
- **Loading States**: Visual feedback during API operations
- **Validation**: Client and server-side validation with user-friendly messages

### ✅ S11-6: Employee can only change products at the store they work at
- **Authorization**: Middleware checks employee store assignment
- **Data Filtering**: Products automatically filtered by employee's assigned store
- **Access Control**: Prevents cross-store data access
- **Store Display**: Employee dashboard shows their assigned store information

## Technical Implementation

### Backend Components

#### Models
- **User Model**: Extended with employee details and store assignment
- **GroceryItem Model**: Enhanced with stock tracking and audit trail

#### Routes (`/routes/employee.js`)
```javascript
GET    /api/employee/products              // List products with filters
PATCH  /api/employee/products/:id/stock-status  // Update stock status
GET    /api/employee/products/:id         // Get product details
GET    /api/employee/products/:id/history // Get stock history
```

#### Middleware
- **Authentication**: Verify employee login
- **Authorization**: Ensure employee role and store access
- **Validation**: Validate stock status updates

### Frontend Components

#### Pages
- **EmployeePage**: Main employee interface page
- **EmployeeDashboard**: Core functionality component

#### Features
- **Product Grid**: Display products with stock information
- **Filter Controls**: Search, category, status, and sort options
- **Stock Update Modal**: Detailed interface for status changes
- **Quick Actions**: One-click out-of-stock marking
- **Pagination**: Navigate through product lists

## Database Schema

### User Model Extensions
```javascript
{
  role: ['user', 'employee', 'admin'],
  employeeDetails: {
    storeId: String,
    storeName: String,
    storeLocation: String,
    employeeId: String,
    department: String,
    startDate: Date,
    isActive: Boolean
  }
}
```

### GroceryItem Model Extensions
```javascript
{
  stockStatus: ['in-stock', 'out-of-stock', 'low-stock', 'discontinued'],
  stockCount: Number,
  lastStockUpdate: {
    updatedBy: ObjectId,
    updatedAt: Date,
    previousStatus: String,
    newStatus: String,
    reason: String,
    employeeName: String,
    employeeId: String
  }
}
```

## API Documentation

### Authentication
All employee endpoints require Bearer token authentication:
```
Authorization: Bearer <token>
```

### Get Products with Filters
```http
GET /api/employee/products
Query Parameters:
- q: Search text
- category: Product category
- stockStatus: Stock status filter
- sortBy: Sort field (itemName, price, category, stockStatus, stockCount)
- sortOrder: asc|desc
- page: Page number
- limit: Items per page
```

### Update Stock Status
```http
PATCH /api/employee/products/:productId/stock-status
Body:
{
  "stockStatus": "out-of-stock",
  "reason": "Optional reason",
  "stockCount": 0
}
```

## Testing

### Sample Data
Run the sample data loader to create test employees and products:
```bash
node scripts/loadEmployeeData.js
```

### Test Credentials
- **Employee 1 (Walmart)**: john.employee@grocerease.com / Employee123!
- **Employee 2 (Metro)**: jane.manager@grocerease.com / Manager123!

### Test Cases
Use `testemployee.http` file for comprehensive API testing including:
- Employee authentication
- Product filtering and sorting
- Stock status updates
- Cross-store access prevention
- Error handling scenarios

## Security Features

### Store Isolation
- Employees can only access products from their assigned store
- Server-side validation prevents cross-store modifications
- Store assignment verified on every request

### Audit Trail
- Complete logging of all stock changes
- Employee identification for each action
- Timestamp and reason tracking
- Previous/new status comparison

### Input Validation
- Stock status enum validation
- Stock count minimum validation
- Required field validation
- SQL injection prevention

## Error Handling

### Client-Side
- Network error handling
- Form validation
- Loading state management
- User-friendly error messages

### Server-Side
- Authentication/authorization errors
- Validation errors
- Database errors
- Not found errors
- Access denied errors

## Usage Workflow

1. **Employee Login**: Employee logs in with credentials
2. **Dashboard Access**: Navigate to Employee Dashboard
3. **Product Filtering**: Use filters to find specific products
4. **Product Selection**: Click on products to view details
5. **Stock Update**: Use quick buttons or detailed modal
6. **Confirmation**: Receive success/error feedback
7. **Audit Trail**: Changes logged with employee information

## Future Enhancements

- **Bulk Operations**: Update multiple products at once
- **Mobile Optimization**: Better mobile interface
- **Barcode Scanning**: Quick product identification
- **Inventory Alerts**: Automatic low stock notifications
- **Reporting**: Stock change reports and analytics
- **Real-time Updates**: WebSocket for live stock updates

## Agile Development Notes

This implementation follows agile principles:
- **Incremental**: Core functionality first, enhancements later
- **Testable**: Comprehensive test cases and sample data
- **Modular**: Separated concerns and reusable components
- **Documented**: Clear documentation for future developers
- **Extensible**: Easy to add new features and modifications
