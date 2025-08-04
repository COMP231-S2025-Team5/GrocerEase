/**
 * Employee Stock Management Routes
 * Handles marking products as out of stock (S11-1 to S11-6)
 */

import express from 'express';
import GroceryItem from '../models/GroceryItem.js';
import User from '../models/User.js';
import Store from '../models/Store.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Middleware to check if user is an employee
const requireEmployee = async (req, res, next) => {
  try {
    if (req.user.role !== 'employee' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Employee privileges required.'
      });
    }
    
    // Get employee details
    const employee = await User.findById(req.user.userId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.'
      });
    }
    
    req.employee = employee;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// S11-1: Get products with sorting/filtering for employee's store
router.get('/products', auth, requireEmployee, async (req, res) => {
  try {
    const {
      q,              // Search query
      category,       // Category filter
      stockStatus,    // Stock status filter
      sortBy = 'itemName',
      sortOrder = 'asc',
      page = 1,
      limit = 20
    } = req.query;

    // S11-6: Employee can only see products from their store
    // Support both new Store reference and legacy embedded store data
    let storeFilter = {};
    
    if (req.employee.role !== 'admin') {
      // Try to use new Store reference first
      if (req.employee.employeeDetails?.store) {
        const employeeStore = await Store.findById(req.employee.employeeDetails.store);
        if (employeeStore) {
          storeFilter = {
            $or: [
              { 'store._id': req.employee.employeeDetails.store },
              { 'store.name': employeeStore.name }
            ]
          };
        }
      } else if (req.employee.employeeDetails?.storeName) {
        // Fallback to legacy embedded store name
        storeFilter = { 'store.name': req.employee.employeeDetails.storeName };
      }
    }

    // Build filter query
    const filterQuery = { ...storeFilter };

    if (q && q.trim() !== '') {
      filterQuery.$or = [
        { itemName: { $regex: q.trim(), $options: 'i' } },
        { 'store.name': { $regex: q.trim(), $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      filterQuery.category = category;
    }

    if (stockStatus && stockStatus !== 'all') {
      filterQuery.stockStatus = stockStatus;
    }

    // Build sort options
    const order = sortOrder === 'desc' ? -1 : 1;
    const sortOptions = {};
    sortOptions[sortBy] = order;

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [products, totalCount] = await Promise.all([
      GroceryItem.find(filterQuery)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      GroceryItem.countDocuments(filterQuery)
    ]);

    // Get filter options for employee's store
    const [categories, stockStatuses] = await Promise.all([
      GroceryItem.distinct('category', storeFilter),
      GroceryItem.distinct('stockStatus', storeFilter)
    ]);

    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        products,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalCount / limitNum),
          totalItems: totalCount,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
          hasPrevPage: pageNum > 1
        },
        filters: {
          categories: categories.sort(),
          stockStatuses: stockStatuses.sort()
        },
        employeeStore: {
          name: req.employee.employeeDetails?.storeName || 'All Stores',
          location: req.employee.employeeDetails?.storeLocation || ''
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// S11-2, S11-3, S11-4: Mark product as out of stock
router.patch('/products/:productId/stock-status', auth, requireEmployee, async (req, res) => {
  try {
    const { productId } = req.params;
    const { stockStatus, reason, stockCount } = req.body;

    // Validate stock status
    const validStatuses = ['in-stock', 'out-of-stock', 'low-stock', 'discontinued'];
    if (!validStatuses.includes(stockStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stock status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    // Find the product
    const product = await GroceryItem.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // S11-6: Check if employee can modify this product (same store)
    if (req.employee.role !== 'admin') {
      let canModify = false;
      
      // Check with new Store reference
      if (req.employee.employeeDetails?.store && product.store._id) {
        canModify = product.store._id.toString() === req.employee.employeeDetails.store.toString();
      }
      
      // Fallback to legacy store name comparison
      if (!canModify && req.employee.employeeDetails?.storeName && product.store.name) {
        canModify = product.store.name === req.employee.employeeDetails.storeName;
      }
      
      if (!canModify) {
        return res.status(403).json({
          success: false,
          message: 'You can only modify products from your assigned store'
        });
      }
    }

    // Store previous status for audit trail
    const previousStatus = product.stockStatus;

    // Update product stock status
    const updateData = {
      stockStatus,
      lastStockUpdate: {
        updatedBy: req.employee._id,
        updatedAt: new Date(),
        previousStatus,
        newStatus: stockStatus,
        reason: reason || `Status changed to ${stockStatus}`,
        employeeName: req.employee.name,
        employeeId: req.employee.employeeDetails?.employeeId || req.employee._id
      }
    };

    // Update stock count if provided
    if (stockCount !== undefined) {
      updateData.stockCount = parseInt(stockCount) || 0;
    }

    // Set isActive based on stock status
    if (stockStatus === 'discontinued') {
      updateData.isActive = false;
    } else if (stockStatus === 'in-stock') {
      updateData.isActive = true;
    }

    const updatedProduct = await GroceryItem.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    // S11-5: Success response
    res.json({
      success: true,
      message: `Product successfully marked as ${stockStatus}`,
      data: {
        product: {
          id: updatedProduct._id,
          itemName: updatedProduct.itemName,
          stockStatus: updatedProduct.stockStatus,
          stockCount: updatedProduct.stockCount,
          isActive: updatedProduct.isActive,
          store: updatedProduct.store,
          lastStockUpdate: updatedProduct.lastStockUpdate
        },
        action: {
          performedBy: req.employee.name,
          timestamp: new Date(),
          change: `${previousStatus} → ${stockStatus}`
        }
      }
    });

  } catch (error) {
    let errorMessage = 'Failed to update stock status';
    if (error.name === 'ValidationError') {
      errorMessage = 'Invalid data provided';
    } else if (error.name === 'CastError') {
      errorMessage = 'Invalid product ID';
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get specific product details for employee
router.get('/products/:productId', auth, requireEmployee, async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await GroceryItem.findById(productId).lean();
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // S11-6: Check if employee can view this product
    if (req.employee.role !== 'admin' && 
        product.store.name !== req.employee.employeeDetails.storeName) {
      return res.status(403).json({
        success: false,
        message: 'You can only view products from your assigned store'
      });
    }

    res.json({
      success: true,
      data: { product }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product details',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get stock status history for a product
router.get('/products/:productId/history', auth, requireEmployee, async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await GroceryItem.findById(productId)
      .populate('lastStockUpdate.updatedBy', 'name email')
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // S11-6: Check permissions
    if (req.employee.role !== 'admin' && 
        product.store.name !== req.employee.employeeDetails.storeName) {
      return res.status(403).json({
        success: false,
        message: 'You can only view history for products from your assigned store'
      });
    }

    res.json({
      success: true,
      data: {
        productId: product._id,
        itemName: product.itemName,
        currentStatus: product.stockStatus,
        lastUpdate: product.lastStockUpdate
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product history'
    });
  }
});

// Employee can add new item to their store
router.post('/products', auth, requireEmployee, async (req, res) => {
  try {
    const {
      itemName,
      category,
      price,
      unitDetails,
      stockCount = 0,
      stockStatus = 'in-stock',
      description,
      nutritionalInfo,
      barcode
    } = req.body;

    // Validate required fields
    if (!itemName || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Item name, category, and price are required'
      });
    }

    // Get employee's store information
    let storeData = {};
    if (req.employee.employeeDetails?.store) {
      const employeeStore = await Store.findById(req.employee.employeeDetails.store);
      if (employeeStore) {
        storeData = {
          _id: employeeStore._id,
          name: employeeStore.name,
          location: employeeStore.location || '',
          address: employeeStore.address || ''
        };
      }
    } else if (req.employee.employeeDetails?.storeName) {
      // Fallback to legacy store data
      storeData = {
        name: req.employee.employeeDetails.storeName,
        location: req.employee.employeeDetails.storeLocation || ''
      };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Employee store information not found'
      });
    }

    // Create new product
    const newProduct = new GroceryItem({
      itemName,
      category,
      price: parseFloat(price),
      unitDetails: unitDetails || {},
      stockCount: parseInt(stockCount) || 0,
      stockStatus,
      description: description || '',
      nutritionalInfo: nutritionalInfo || {},
      barcode: barcode || '',
      store: storeData,
      isActive: true,
      lastStockUpdate: {
        updatedBy: req.employee._id,
        updatedAt: new Date(),
        previousStatus: null,
        newStatus: stockStatus,
        reason: 'Product added by employee',
        employeeName: req.employee.name,
        employeeId: req.employee.employeeDetails?.employeeId || req.employee._id
      }
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: {
        product: savedProduct
      }
    });

  } catch (error) {
    let errorMessage = 'Failed to add product';
    if (error.name === 'ValidationError') {
      errorMessage = 'Invalid product data: ' + Object.values(error.errors).map(e => e.message).join(', ');
    } else if (error.code === 11000) {
      errorMessage = 'Product with this name already exists in your store';
    }

    res.status(400).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Employee can update item details (not just stock status)
router.put('/products/:productId', auth, requireEmployee, async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      itemName,
      category,
      price,
      unitDetails,
      stockCount,
      stockStatus,
      description,
      nutritionalInfo,
      barcode
    } = req.body;

    // Find the product
    const product = await GroceryItem.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if employee can modify this product (same store)
    if (req.employee.role !== 'admin') {
      let canModify = false;
      
      // Check with new Store reference
      if (req.employee.employeeDetails?.store && product.store._id) {
        canModify = product.store._id.toString() === req.employee.employeeDetails.store.toString();
      }
      
      // Fallback to legacy store name comparison
      if (!canModify && req.employee.employeeDetails?.storeName && product.store.name) {
        canModify = product.store.name === req.employee.employeeDetails.storeName;
      }
      
      if (!canModify) {
        return res.status(403).json({
          success: false,
          message: 'You can only modify products from your assigned store'
        });
      }
    }

    // Prepare update data
    const updateData = {};
    const previousData = {
      itemName: product.itemName,
      category: product.category,
      price: product.price,
      stockStatus: product.stockStatus,
      stockCount: product.stockCount
    };

    // Update only provided fields
    if (itemName !== undefined) updateData.itemName = itemName;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (unitDetails !== undefined) updateData.unitDetails = unitDetails;
    if (stockCount !== undefined) updateData.stockCount = parseInt(stockCount) || 0;
    if (stockStatus !== undefined) updateData.stockStatus = stockStatus;
    if (description !== undefined) updateData.description = description;
    if (nutritionalInfo !== undefined) updateData.nutritionalInfo = nutritionalInfo;
    if (barcode !== undefined) updateData.barcode = barcode;

    // Add update tracking
    updateData.lastStockUpdate = {
      updatedBy: req.employee._id,
      updatedAt: new Date(),
      previousStatus: product.stockStatus,
      newStatus: stockStatus || product.stockStatus,
      reason: 'Product details updated by employee',
      employeeName: req.employee.name,
      employeeId: req.employee.employeeDetails?.employeeId || req.employee._id
    };

    const updatedProduct = await GroceryItem.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product: updatedProduct,
        changes: {
          performedBy: req.employee.name,
          timestamp: new Date(),
          previousData,
          newData: {
            itemName: updatedProduct.itemName,
            category: updatedProduct.category,
            price: updatedProduct.price,
            stockStatus: updatedProduct.stockStatus,
            stockCount: updatedProduct.stockCount
          }
        }
      }
    });

  } catch (error) {
    let errorMessage = 'Failed to update product';
    if (error.name === 'ValidationError') {
      errorMessage = 'Invalid product data: ' + Object.values(error.errors).map(e => e.message).join(', ');
    } else if (error.name === 'CastError') {
      errorMessage = 'Invalid product ID';
    }

    res.status(400).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Employee can remove item from their store
router.delete('/products/:productId', auth, requireEmployee, async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the product
    const product = await GroceryItem.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if employee can modify this product (same store)
    if (req.employee.role !== 'admin') {
      let canModify = false;
      
      // Check with new Store reference
      if (req.employee.employeeDetails?.store && product.store._id) {
        canModify = product.store._id.toString() === req.employee.employeeDetails.store.toString();
      }
      
      // Fallback to legacy store name comparison
      if (!canModify && req.employee.employeeDetails?.storeName && product.store.name) {
        canModify = product.store.name === req.employee.employeeDetails.storeName;
      }
      
      if (!canModify) {
        return res.status(403).json({
          success: false,
          message: 'You can only remove products from your assigned store'
        });
      }
    }

    // Store product info before deletion for response
    const deletedProductInfo = {
      id: product._id,
      itemName: product.itemName,
      category: product.category,
      store: product.store
    };

    // Delete the product
    await GroceryItem.findByIdAndDelete(productId);

    res.json({
      success: true,
      message: 'Product removed successfully',
      data: {
        deletedProduct: deletedProductInfo,
        action: {
          performedBy: req.employee.name,
          timestamp: new Date(),
          action: 'Product removed from store inventory'
        }
      }
    });

  } catch (error) {
    let errorMessage = 'Failed to remove product';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid product ID';
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;
