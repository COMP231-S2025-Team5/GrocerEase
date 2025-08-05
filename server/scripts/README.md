# GrocerEase Test Data Setup

This script provides comprehensive test data for the GrocerEase application, including stores, users of all types, and grocery items.

## Quick Setup

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Run the test data script:**
   ```bash
   npm run load-test-data
   ```

## What Gets Created

### 🏪 **3 Test Stores**
- **Walmart Superstore** (Downtown Toronto)
- **Metro Plus** (Uptown Mall Toronto)  
- **Loblaws City Market** (Financial District Toronto)

### 👥 **11 Test Users**

#### 👑 **Admins (2)**
- `admin@grocerease.com` / `Admin123!`
- `sarah.admin@grocerease.com` / `Admin123!`

#### 👷 **Employees (4)**
- `john.smith@grocerease.com` / `Employee123!` (Walmart)
- `maria.garcia@grocerease.com` / `Employee123!` (Metro)
- `david.wilson@grocerease.com` / `Employee123!` (Loblaws)
- `lisa.chen@grocerease.com` / `Employee123!` (Walmart)

#### 👤 **Regular Users (5)**
- `alice.johnson@email.com` / `User123!`
- `bob.davis@email.com` / `User123!`
- `carol.brown@email.com` / `User123!`
- `daniel.lee@email.com` / `User123!`
- `emma.taylor@email.com` / `User123!`

### 🛒 **27 Grocery Items**
Items distributed across all stores with:
- Various stock statuses (in-stock, low-stock, out-of-stock)
- Some items with promotions and deals
- All product categories (fruits, vegetables, meat, dairy, bakery, pantry, frozen, beverages, snacks, household, personal-care)
- Different unit types (lb, oz, kg, g, item, each, pack, bottle, can, box, bag)

## Running the Script

The script will:
1. Clear existing data (stores, users, items)
2. Create 3 test stores with full details
3. Create 11 users with hashed passwords
4. Create 27 grocery items distributed across stores
5. Display a complete summary with test credentials

## After Running

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Start the client:**
   ```bash
   cd ../client
   npm run dev
   ```

3. **Test the application:**
   - Go to `http://localhost:3000`
   - Login with any of the test credentials
   - Explore role-based features

## Troubleshooting

- **MongoDB Connection**: Ensure MongoDB is running and the connection string in `.env` is correct
- **Missing Dependencies**: Run `npm install` in the server directory
- **Port Conflicts**: Check that ports 3000 (client) and 5000 (server) are available

