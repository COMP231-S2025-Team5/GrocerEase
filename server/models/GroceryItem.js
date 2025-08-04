import mongoose from 'mongoose';

const groceryItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [100, 'Item name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  promotion: {
    type: String,
    trim: true,
    maxlength: [200, 'Promotion description cannot exceed 200 characters']
  },
  store: {
    // New store reference
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store'
    },
    // Keep legacy embedded store data for backward compatibility
    name: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    }
  },
  itemImage: {
    url: {
      type: String,
      trim: true
    },
    altText: {
      type: String,
      trim: true
    }
  },
  unitDetails: {
    unit: {
      type: String,
      enum: ['lb', 'oz', 'kg', 'g', 'item', 'each', 'pack', 'bottle', 'can', 'box', 'bag'],
      default: 'item'
    },
    quantity: {
      type: Number,
      min: [0, 'Quantity cannot be negative'],
      default: 1
    },
    pricePerUnit: {
      type: Number,
      min: [0, 'Price per unit cannot be negative']
    }
  },
  category: {
    type: String,
    enum: [
      'fruits', 'vegetables', 'meat', 'dairy', 'bakery', 'pantry', 
      'frozen', 'beverages', 'snacks', 'household', 'personal-care', 'other'
    ],
    default: 'other'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // S11-4: Stock status tracking for out-of-stock functionality
  stockStatus: {
    type: String,
    enum: ['in-stock', 'out-of-stock', 'low-stock', 'discontinued'],
    default: 'in-stock'
  },
  stockCount: {
    type: Number,
    min: [0, 'Stock count cannot be negative'],
    default: 0
  },
  // S11-4 & S11-5: Track employee actions for audit trail
  lastStockUpdate: {
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    previousStatus: String,
    newStatus: String,
    reason: String,
    employeeName: String,
    employeeId: String
  },
  dealValidUntil: {
    type: Date
  }
}, {
  timestamps: true
});

// Calculate price per unit before saving
groceryItemSchema.pre('save', function(next) {
  if (this.price && this.unitDetails.quantity) {
    this.unitDetails.pricePerUnit = this.price / this.unitDetails.quantity;
  }
  next();
});

// Index for search functionality
groceryItemSchema.index({ itemName: 'text', 'store.name': 'text', category: 1 });
groceryItemSchema.index({ price: 1 });
groceryItemSchema.index({ 'store.name': 1 });
groceryItemSchema.index({ category: 1 });
groceryItemSchema.index({ createdAt: -1 });

const GroceryItem = mongoose.model('GroceryItem', groceryItemSchema, 'items');

export default GroceryItem;
