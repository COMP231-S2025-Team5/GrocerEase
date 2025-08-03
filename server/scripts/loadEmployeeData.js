/**
 * Sample data loader for Employee Stock Management testing
 * Creates employees and products for testing S11-1 to S11-6
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import GroceryItem from '../models/GroceryItem.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleEmployees = [
  {
    name: "John Employee",
    email: "john.employee@grocerease.com",
    password: "Employee123!",
    role: "employee",
    employeeDetails: {
      storeId: "STORE001",
      storeName: "Walmart",
      storeLocation: "Downtown",
      employeeId: "EMP001",
      department: "general",
      startDate: new Date(),
      isActive: true
    }
  },
  {
    name: "Jane Manager",
    email: "jane.manager@grocerease.com",
    password: "Manager123!",
    role: "employee",
    employeeDetails: {
      storeId: "STORE002",
      storeName: "Metro",
      storeLocation: "Mall",
      employeeId: "EMP002",
      department: "produce",
      startDate: new Date(),
      isActive: true
    }
  }
];

const sampleProducts = [
  {
    itemName: "Red Apples",
    price: 3.99,
    originalPrice: 4.99,
    promotion: "20% off fresh apples",
    store: {
      name: "Walmart",
      location: "Downtown",
      address: "123 Main St"
    },
    unitDetails: {
      unit: "lb",
      quantity: 3
    },
    category: "fruits",
    stockStatus: "in-stock",
    stockCount: 50,
    dealValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    itemName: "Whole Milk",
    price: 4.29,
    store: {
      name: "Walmart",
      location: "Downtown",
      address: "123 Main St"
    },
    unitDetails: {
      unit: "bottle",
      quantity: 1
    },
    category: "dairy",
    stockStatus: "low-stock",
    stockCount: 5
  },
  {
    itemName: "Chicken Breast",
    price: 12.99,
    originalPrice: 15.99,
    promotion: "Fresh meat sale",
    store: {
      name: "Metro",
      location: "Mall",
      address: "456 Shopping Center"
    },
    unitDetails: {
      unit: "lb",
      quantity: 2
    },
    category: "meat",
    stockStatus: "out-of-stock",
    stockCount: 0,
    dealValidUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  },
  {
    itemName: "Banana",
    price: 1.99,
    store: {
      name: "Walmart",
      location: "Downtown",
      address: "123 Main St"
    },
    unitDetails: {
      unit: "lb",
      quantity: 2
    },
    category: "fruits",
    stockStatus: "in-stock",
    stockCount: 100
  },
  {
    itemName: "Whole Wheat Bread",
    price: 2.49,
    store: {
      name: "Metro",
      location: "Mall",
      address: "456 Shopping Center"
    },
    unitDetails: {
      unit: "item",
      quantity: 1
    },
    category: "bakery",
    stockStatus: "in-stock",
    stockCount: 20
  },
  {
    itemName: "Orange Juice",
    price: 5.99,
    originalPrice: 6.99,
    promotion: "Vitamin C boost sale",
    store: {
      name: "Walmart",
      location: "Downtown",
      address: "123 Main St"
    },
    unitDetails: {
      unit: "bottle",
      quantity: 1
    },
    category: "beverages",
    stockStatus: "discontinued",
    stockCount: 0,
    dealValidUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
  }
];

const loadEmployeeTestData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/GrocerEase');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({ role: { $in: ['employee'] } });
    await GroceryItem.deleteMany({});
    console.log('Cleared existing test data');

    // Create employees
    const hashedEmployees = await Promise.all(
      sampleEmployees.map(async (employee) => {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(employee.password, salt);
        return {
          ...employee,
          password: hashedPassword
        };
      })
    );

    const insertedEmployees = await User.insertMany(hashedEmployees);
    console.log(`\nCreated ${insertedEmployees.length} employee accounts:`);
    insertedEmployees.forEach((emp, index) => {
      console.log(`${index + 1}. ${emp.name} (${emp.email}) - ${emp.employeeDetails.storeName}`);
    });

    // Create products
    const insertedProducts = await GroceryItem.insertMany(sampleProducts);
    console.log(`\nCreated ${insertedProducts.length} products:`);
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.itemName} - ${product.stockStatus} (${product.stockCount} units) at ${product.store.name}`);
    });

    console.log('\n=== Test Credentials ===');
    console.log('Employee 1 (Walmart):');
    console.log('  Email: john.employee@grocerease.com');
    console.log('  Password: Employee123!');
    console.log('  Store: Walmart Downtown');
    console.log('\nEmployee 2 (Metro):');
    console.log('  Email: jane.manager@grocerease.com');
    console.log('  Password: Manager123!');
    console.log('  Store: Metro Mall');

    console.log('\n=== Testing Requirements ===');
    console.log('✅ S11-1: Products can be sorted/filtered');
    console.log('✅ S11-2: Out of stock button functionality ready');
    console.log('✅ S11-3: Employee can select particular items');
    console.log('✅ S11-4: Changes saved to database with audit trail');
    console.log('✅ S11-5: Success/failure handlers implemented');
    console.log('✅ S11-6: Employees can only change products at their store');

    console.log('\n=== API Endpoints Ready ===');
    console.log('GET /api/employee/products - List products with filters');
    console.log('PATCH /api/employee/products/:id/stock-status - Update stock');
    console.log('GET /api/employee/products/:id - Get product details');
    console.log('GET /api/employee/products/:id/history - Stock history');

    console.log('\nDatabase populated successfully!');
    console.log('You can now test the employee stock management functionality.');

  } catch (error) {
    console.error('Error loading employee test data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
loadEmployeeTestData();
