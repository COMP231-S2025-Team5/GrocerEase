/**
 * Store Management Routes
 * Handles CRUD operations for stores and employee assignments
 */

import express from 'express';
import Store from '../models/Store.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Middleware to check if user is an admin
const requireAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all stores
router.get('/', auth, async (req, res) => {
  try {
    const { includeEmployees = false } = req.query;
    
    let query = Store.find({ isActive: true });
    
    if (includeEmployees === 'true') {
      query = query.populate('employees', 'name email employeeDetails.department employeeDetails.employeeId');
    }
    
    const stores = await query.sort({ name: 1 });

    res.json({
      success: true,
      message: 'Stores retrieved successfully',
      data: stores
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stores',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get a specific store by ID
router.get('/:storeId', auth, async (req, res) => {
  try {
    const { storeId } = req.params;
    
    const store = await Store.findById(storeId)
      .populate('employees', 'name email employeeDetails.department employeeDetails.employeeId');

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    res.json({
      success: true,
      message: 'Store retrieved successfully',
      data: store
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching store',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Create a new store (Admin only)
router.post('/', auth, requireAdmin, async (req, res) => {
  try {
    const { name, location, address, contactInfo, operatingHours } = req.body;

    // Check if store with same name already exists
    const existingStore = await Store.findOne({ name });
    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: 'A store with this name already exists'
      });
    }

    const store = new Store({
      name,
      location,
      address,
      contactInfo,
      operatingHours,
      employees: []
    });

    await store.save();

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: store
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating store',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update a store (Admin only)
router.put('/:storeId', auth, requireAdmin, async (req, res) => {
  try {
    const { storeId } = req.params;
    const updateData = req.body;

    const store = await Store.findByIdAndUpdate(
      storeId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    res.json({
      success: true,
      message: 'Store updated successfully',
      data: store
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating store',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Assign employee to store (Admin only)
router.post('/:storeId/employees/:employeeId', auth, requireAdmin, async (req, res) => {
  try {
    const { storeId, employeeId } = req.params;

    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user exists and is an employee
    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== 'employee') {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Check if employee is already assigned to this store
    if (store.employees.includes(employeeId)) {
      return res.status(400).json({
        success: false,
        message: 'Employee is already assigned to this store'
      });
    }

    // Add employee to store
    store.employees.push(employeeId);
    await store.save();

    // Update employee's store reference
    employee.employeeDetails.store = storeId;
    employee.employeeDetails.storeName = store.name;
    employee.employeeDetails.storeLocation = store.location;
    await employee.save();

    res.json({
      success: true,
      message: 'Employee assigned to store successfully',
      data: {
        store: store.name,
        employee: employee.name
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error assigning employee to store',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Remove employee from store (Admin only)
router.delete('/:storeId/employees/:employeeId', auth, requireAdmin, async (req, res) => {
  try {
    const { storeId, employeeId } = req.params;

    // Remove employee from store
    const store = await Store.findByIdAndUpdate(
      storeId,
      { $pull: { employees: employeeId } },
      { new: true }
    );

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Clear employee's store reference
    await User.findByIdAndUpdate(employeeId, {
      $unset: { 
        'employeeDetails.store': '',
        'employeeDetails.storeName': '',
        'employeeDetails.storeLocation': ''
      }
    });

    res.json({
      success: true,
      message: 'Employee removed from store successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing employee from store',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Delete store (Admin only)
router.delete('/:storeId', auth, requireAdmin, async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if store has employees
    if (store.employees.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete store with assigned employees. Please reassign employees first.'
      });
    }

    // Soft delete - mark as inactive
    store.isActive = false;
    await store.save();

    res.json({
      success: true,
      message: 'Store deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting store',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;
