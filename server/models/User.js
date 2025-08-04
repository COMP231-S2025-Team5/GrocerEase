import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'employee', 'admin'],
    default: 'user'
  },
  // Employee-specific fields (S11-6: Employee can only change products at their store)
  employeeDetails: {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: function() { return this.role === 'employee'; }
    },
    // Keep legacy fields for backward compatibility (will be deprecated)
    storeId: {
      type: String,
      required: false
    },
    storeName: {
      type: String,
      required: false
    },
    storeLocation: {
      type: String,
      required: false
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true // Only unique if present
    },
    department: {
      type: String,
      enum: ['general', 'produce', 'meat', 'dairy', 'bakery', 'pharmacy'],
      default: 'general'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
