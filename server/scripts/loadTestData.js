/**
 * Comprehensive Test Data Loader for GrocerEase
 * Creates stores, users (admin, employees, regular users), and items for complete app testing
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import GroceryItem from '../models/GroceryItem.js';
import Store from '../models/Store.js';
import dotenv from 'dotenv';

dotenv.config();

// Test Stores
const testStores = [
  {
    name: "Walmart Superstore",
    location: "Downtown",
    address: {
      street: "123 Main Street",
      city: "Toronto",
      province: "Ontario",
      postalCode: "M5V 3A8"
    },
    contactInfo: {
      phone: "(416) 555-0101",
      email: "downtown@walmart.ca"
    },
    operatingHours: {
      monday: { open: "07:00", close: "23:00" },
      tuesday: { open: "07:00", close: "23:00" },
      wednesday: { open: "07:00", close: "23:00" },
      thursday: { open: "07:00", close: "23:00" },
      friday: { open: "07:00", close: "23:00" },
      saturday: { open: "08:00", close: "22:00" },
      sunday: { open: "09:00", close: "21:00" }
    },
    isActive: true
  },
  {
    name: "Metro Plus",
    location: "Uptown Mall",
    address: {
      street: "456 Shopping Plaza",
      city: "Toronto",
      province: "Ontario",
      postalCode: "M4W 2G7"
    },
    contactInfo: {
      phone: "(416) 555-0202",
      email: "uptown@metro.ca"
    },
    operatingHours: {
      monday: { open: "08:00", close: "22:00" },
      tuesday: { open: "08:00", close: "22:00" },
      wednesday: { open: "08:00", close: "22:00" },
      thursday: { open: "08:00", close: "22:00" },
      friday: { open: "08:00", close: "22:00" },
      saturday: { open: "08:00", close: "21:00" },
      sunday: { open: "09:00", close: "20:00" }
    },
    isActive: true
  },
  {
    name: "Loblaws City Market",
    location: "Financial District",
    address: {
      street: "789 Business Avenue",
      city: "Toronto",
      province: "Ontario",
      postalCode: "M5H 1T1"
    },
    contactInfo: {
      phone: "(416) 555-0303",
      email: "financial@loblaws.ca"
    },
    operatingHours: {
      monday: { open: "06:00", close: "24:00" },
      tuesday: { open: "06:00", close: "24:00" },
      wednesday: { open: "06:00", close: "24:00" },
      thursday: { open: "06:00", close: "24:00" },
      friday: { open: "06:00", close: "24:00" },
      saturday: { open: "07:00", close: "23:00" },
      sunday: { open: "08:00", close: "22:00" }
    },
    isActive: true
  }
];

// Test Users (Admin, Employees, Regular Users)
const testUsers = [
  // Admin Users
  {
    name: "Admin User",
    email: "admin@grocerease.com",
    password: "Admin123!",
    role: "admin"
  },
  {
    name: "Sarah Admin",
    email: "sarah.admin@grocerease.com",
    password: "Admin123!",
    role: "admin"
  },
  
  // Employee Users (will be assigned to stores after store creation)
  {
    name: "John Smith",
    email: "john.smith@grocerease.com",
    password: "Employee123!",
    role: "employee",
    employeeDetails: {
      employeeId: "EMP001",
      department: "general",
      startDate: new Date(),
      isActive: true
    }
  },
  {
    name: "Maria Garcia",
    email: "maria.garcia@grocerease.com",
    password: "Employee123!",
    role: "employee",
    employeeDetails: {
      employeeId: "EMP002",
      department: "produce",
      startDate: new Date(),
      isActive: true
    }
  },
  {
    name: "David Wilson",
    email: "david.wilson@grocerease.com",
    password: "Employee123!",
    role: "employee",
    employeeDetails: {
      employeeId: "EMP003",
      department: "dairy",
      startDate: new Date(),
      isActive: true
    }
  },
  {
    name: "Lisa Chen",
    email: "lisa.chen@grocerease.com",
    password: "Employee123!",
    role: "employee",
    employeeDetails: {
      employeeId: "EMP004",
      department: "bakery",
      startDate: new Date(),
      isActive: true
    }
  },
  
  // Regular Users
  {
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    password: "User123!",
    role: "user"
  },
  {
    name: "Bob Davis",
    email: "bob.davis@email.com",
    password: "User123!",
    role: "user"
  },
  {
    name: "Carol Brown",
    email: "carol.brown@email.com",
    password: "User123!",
    role: "user"
  },
  {
    name: "Daniel Lee",
    email: "daniel.lee@email.com",
    password: "User123!",
    role: "user"
  },
  {
    name: "Emma Taylor",
    email: "emma.taylor@email.com",
    password: "User123!",
    role: "user"
  }
];

// Sample grocery items with images for each store
const sampleItems = [
  // Walmart Superstore items
  {
    itemName: "Organic Bananas",
    price: 2.49,
    category: "fruits",
    unitDetails: { unit: "lb", quantity: 1, pricePerUnit: 2.49 },
    stockStatus: "in-stock",
    stockCount: 50,
    itemImage: {
      url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop",
      altText: "Fresh organic bananas"
    }
  },
  {
    itemName: "Whole Milk",
    price: 4.29,
    category: "dairy",
    unitDetails: { unit: "bottle", quantity: 1, pricePerUnit: 4.29 },
    stockStatus: "in-stock",
    stockCount: 25,
    itemImage: {
      url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop",
      altText: "Fresh whole milk"
    }
  },
  {
    itemName: "Fresh Salmon Fillet",
    price: 12.99,
    originalPrice: 15.99,
    category: "meat",
    unitDetails: { unit: "lb", quantity: 1, pricePerUnit: 12.99 },
    stockStatus: "low-stock",
    stockCount: 8,
    promotion: "Weekend Special - 20% off fresh salmon!",
    dealValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    itemName: "Artisan Sourdough Bread",
    price: 3.99,
    category: "bakery",
    unitDetails: { unit: "each", quantity: 1, pricePerUnit: 3.99 },
    stockStatus: "in-stock",
    stockCount: 15,
    itemImage: {
      url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
      altText: "Artisan sourdough bread loaf"
    }
  },
  {
    itemName: "Organic Baby Spinach",
    price: 3.49,
    category: "vegetables",
    unitDetails: { unit: "bag", quantity: 1, pricePerUnit: 3.49 },
    stockStatus: "in-stock",
    stockCount: 30,
    itemImage: {
      url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop",
      altText: "Fresh organic baby spinach"
    }
  },
  {
    itemName: "Premium Ground Coffee",
    price: 8.99,
    category: "beverages",
    unitDetails: { unit: "bag", quantity: 1, pricePerUnit: 8.99 },
    stockStatus: "in-stock",
    stockCount: 20,
    itemImage: {
      url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
      altText: "Premium ground coffee beans"
    }
  },
  {
    itemName: "Greek Yogurt",
    price: 5.49,
    category: "dairy",
    unitDetails: { unit: "pack", quantity: 4, pricePerUnit: 1.37 },
    stockStatus: "in-stock",
    stockCount: 40,
  },
  {
    itemName: "Pasta Sauce",
    price: 2.99,
    category: "pantry",
    unitDetails: { unit: "bottle", quantity: 1, pricePerUnit: 2.99 },
    stockStatus: "out-of-stock",
    stockCount: 0,
  },
  {
    itemName: "Frozen Pizza",
    price: 6.99,
    originalPrice: 8.99,
    category: "frozen",
    unitDetails: { unit: "each", quantity: 1, pricePerUnit: 6.99 },
    stockStatus: "in-stock",
    stockCount: 12,
    promotion: "Buy 2 Get 1 Free on frozen pizzas!"
  },

  // Metro Plus items
  {
    itemName: "Organic Apples",
    price: 4.99,
    category: "fruits",
    unitDetails: { unit: "bag", quantity: 3, pricePerUnit: 1.66 },
    stockStatus: "in-stock",
    stockCount: 35,
    itemImage: {
      url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop",
      altText: "Fresh organic red apples"
    }
  },
  {
    itemName: "Aged Cheddar Cheese",
    price: 7.99,
    category: "dairy",
    unitDetails: { unit: "pack", quantity: 1, pricePerUnit: 7.99 },
    stockStatus: "in-stock",
    stockCount: 18,
    itemImage: {
      url: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop",
      altText: "Aged cheddar cheese block"
    }
  },
  {
    itemName: "Free-Range Chicken Breast",
    price: 9.99,
    category: "meat",
    unitDetails: { unit: "lb", quantity: 2, pricePerUnit: 4.99 },
    stockStatus: "in-stock",
    stockCount: 22,
    itemImage: {
      url: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop",
      altText: "Fresh free-range chicken breast"
    }
  },
  {
    itemName: "Croissants",
    price: 4.49,
    category: "bakery",
    unitDetails: { unit: "pack", quantity: 6, pricePerUnit: 0.75 },
    stockStatus: "low-stock",
    stockCount: 5
  },
  {
    itemName: "Bell Peppers",
    price: 2.99,
    category: "vegetables",
    unitDetails: { unit: "pack", quantity: 3, pricePerUnit: 1.00 },
    stockStatus: "in-stock",
    stockCount: 28,
  },
  {
    itemName: "Orange Juice",
    price: 3.99,
    category: "beverages",
    unitDetails: { unit: "bottle", quantity: 1, pricePerUnit: 3.99 },
    stockStatus: "in-stock",
    stockCount: 16,
    itemImage: {
      url: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop",
      altText: "Fresh orange juice"
    }
  },
  {
    itemName: "Tortilla Chips",
    price: 3.49,
    category: "snacks",
    unitDetails: { unit: "bag", quantity: 1, pricePerUnit: 3.49 },
    stockStatus: "in-stock",
    stockCount: 25,
  },
  {
    itemName: "Ice Cream",
    price: 5.99,
    originalPrice: 7.99,
    category: "frozen",
    unitDetails: { unit: "pack", quantity: 1, pricePerUnit: 5.99 },
    stockStatus: "in-stock",
    stockCount: 14,
    promotion: "Summer Sale - 25% off premium ice cream!",
    dealValidUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    itemImage: {
      url: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400&h=300&fit=crop",
      altText: "Premium vanilla ice cream"
    }
  },
  {
    itemName: "Laundry Detergent",
    price: 12.99,
    category: "household",
    unitDetails: { unit: "bottle", quantity: 1, pricePerUnit: 12.99 },
    stockStatus: "in-stock",
    stockCount: 10,
  },

  // Loblaws City Market items
  {
    itemName: "Avocados",
    price: 1.99,
    category: "fruits",
    unitDetails: { unit: "each", quantity: 1, pricePerUnit: 1.99 },
    stockStatus: "in-stock",
    stockCount: 45,
    itemImage: {
      url: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop",
      altText: "Fresh ripe avocados"
    }
  },
  {
    itemName: "Mozzarella Cheese",
    price: 6.49,
    category: "dairy",
    unitDetails: { unit: "pack", quantity: 1, pricePerUnit: 6.49 },
    stockStatus: "in-stock",
    stockCount: 20,
  },
  {
    itemName: "Ground Beef",
    price: 8.99,
    category: "meat",
    unitDetails: { unit: "lb", quantity: 1, pricePerUnit: 8.99 },
    stockStatus: "in-stock",
    stockCount: 15,
  },
  {
    itemName: "Bagels",
    price: 3.99,
    category: "bakery",
    unitDetails: { unit: "pack", quantity: 6, pricePerUnit: 0.67 },
    stockStatus: "in-stock",
    stockCount: 12,
    itemImage: {
      url: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
      altText: "Fresh sesame bagels"
    }
  },
  {
    itemName: "Broccoli",
    price: 2.49,
    category: "vegetables",
    unitDetails: { unit: "each", quantity: 1, pricePerUnit: 2.49 },
    stockStatus: "low-stock",
    stockCount: 3,
    itemImage: {
      url: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop",
      altText: "Fresh green broccoli"
    }
  },
  {
    itemName: "Sparkling Water",
    price: 4.99,
    category: "beverages",
    unitDetails: { unit: "pack", quantity: 12, pricePerUnit: 0.42 },
    stockStatus: "in-stock",
    stockCount: 30,
  },
  {
    itemName: "Dark Chocolate",
    price: 4.49,
    originalPrice: 5.99,
    category: "snacks",
    unitDetails: { unit: "item", quantity: 1, pricePerUnit: 4.49 },
    stockStatus: "in-stock",
    stockCount: 18,
    promotion: "Valentine's Special - Premium chocolate on sale!",
    dealValidUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    itemImage: {
      url: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=300&fit=crop",
      altText: "Premium dark chocolate bar"
    }
  },
  {
    itemName: "Frozen Berries",
    price: 6.99,
    category: "frozen",
    unitDetails: { unit: "bag", quantity: 1, pricePerUnit: 6.99 },
    stockStatus: "in-stock",
    stockCount: 22,
  },
  {
    itemName: "Hand Soap",
    price: 2.99,
    category: "personal-care",
    unitDetails: { unit: "bottle", quantity: 1, pricePerUnit: 2.99 },
    stockStatus: "in-stock",
    stockCount: 35,
  }
];

const loadCompleteTestData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/GrocerEase');
    console.log('🔗 Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Store.deleteMany({}),
      User.deleteMany({}),
      GroceryItem.deleteMany({})
    ]);
    console.log('🧹 Cleared existing data');

    // Create stores
    const insertedStores = await Store.insertMany(testStores);
    console.log(`🏪 Created ${insertedStores.length} stores:`);
    insertedStores.forEach((store, index) => {
      console.log(`   ${index + 1}. ${store.name} - ${store.location}`);
    });

    // Assign employees to stores and hash passwords
    const hashedUsers = await Promise.all(
      testUsers.map(async (user, index) => {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        const userData = {
          ...user,
          password: hashedPassword
        };

        // Assign employees to stores
        if (user.role === 'employee' && user.employeeDetails) {
          const storeIndex = index % insertedStores.length; // Distribute employees across stores
          const assignedStore = insertedStores[storeIndex];
          userData.employeeDetails = {
            ...user.employeeDetails,
            store: assignedStore._id,
            storeName: assignedStore.name,
            storeLocation: assignedStore.location
          };
        }

        return userData;
      })
    );

    const insertedUsers = await User.insertMany(hashedUsers);
    console.log(`👥 Created ${insertedUsers.length} users:`);
    
    // Group users by role for display
    const usersByRole = insertedUsers.reduce((acc, user) => {
      if (!acc[user.role]) acc[user.role] = [];
      acc[user.role].push(user);
      return acc;
    }, {});

    Object.keys(usersByRole).forEach(role => {
      console.log(`   📋 ${role.toUpperCase()}S (${usersByRole[role].length}):`);
      usersByRole[role].forEach(user => {
        const storeInfo = user.employeeDetails?.storeName ? ` - ${user.employeeDetails.storeName}` : '';
        console.log(`      • ${user.name} (${user.email})${storeInfo}`);
      });
    });

    // Create items distributed across stores
    const itemsWithStores = sampleItems.map((item, index) => {
      const storeIndex = index % insertedStores.length;
      const assignedStore = insertedStores[storeIndex];
      
      return {
        ...item,
        store: {
          _id: assignedStore._id,
          name: assignedStore.name,
          location: assignedStore.location,
          address: `${assignedStore.address.street}, ${assignedStore.address.city}`
        }
      };
    });

    const insertedItems = await GroceryItem.insertMany(itemsWithStores);
    console.log(`🛒 Created ${insertedItems.length} grocery items distributed across stores:`);
    
    // Group items by store
    const itemsByStore = insertedItems.reduce((acc, item) => {
      const storeName = item.store.name;
      if (!acc[storeName]) acc[storeName] = [];
      acc[storeName].push(item);
      return acc;
    }, {});

    Object.keys(itemsByStore).forEach(storeName => {
      console.log(`   🏪 ${storeName} (${itemsByStore[storeName].length} items):`);
      itemsByStore[storeName].slice(0, 3).forEach(item => {
        const promo = item.promotion ? ' 🏷️' : '';
        console.log(`      • ${item.itemName} - $${item.price} (${item.stockStatus})${promo}`);
      });
      if (itemsByStore[storeName].length > 3) {
        console.log(`      ... and ${itemsByStore[storeName].length - 3} more items`);
      }
    });

    // Display test credentials
    console.log('\n🔐 === TEST CREDENTIALS ===');
    console.log('\n👑 ADMIN ACCOUNTS:');
    console.log('   Email: admin@grocerease.com');
    console.log('   Password: Admin123!');
    console.log('   Email: sarah.admin@grocerease.com');
    console.log('   Password: Admin123!');

    console.log('\n👷 EMPLOYEE ACCOUNTS:');
    const employees = insertedUsers.filter(user => user.role === 'employee');
    employees.forEach(emp => {
      console.log(`   Email: ${emp.email}`);
      console.log(`   Password: Employee123!`);
      console.log(`   Store: ${emp.employeeDetails.storeName} - ${emp.employeeDetails.storeLocation}`);
      console.log('   ---');
    });

    console.log('\n👤 REGULAR USER ACCOUNTS:');
    console.log('   Email: alice.johnson@email.com');
    console.log('   Password: User123!');
    console.log('   Email: bob.davis@email.com');
    console.log('   Password: User123!');
    console.log('   (+ 3 more regular users...)');

    console.log('\n📊 === DATA SUMMARY ===');
    console.log(`   ${insertedStores.length} Stores`);
    console.log(`   ${usersByRole.admin?.length || 0} Admins`);
    console.log(`   ${usersByRole.employee?.length || 0} Employees`);
    console.log(`   ${usersByRole.user?.length || 0} Regular Users`);
    console.log(`   ${insertedItems.length} Grocery Items`);
    console.log(`   ${insertedItems.filter(item => item.promotion).length} Items with promotions`);

    console.log('\n🎉 Test database populated successfully!');
    console.log('   Start the server and begin testing at: http://localhost:3000');

  } catch (error) {
    console.error('❌ Error loading test data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the script
loadCompleteTestData();
