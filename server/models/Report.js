import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GroceryItem',
    required: [true, 'Item ID is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    enum: [
      'incorrect-price',
      'expired-deal',
      'out-of-stock',
      'wrong-location',
      'inappropriate-content',
      'duplicate-item',
      'spam',
      'other'
    ]
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'under-review', 'resolved', 'dismissed'],
    default: 'pending'
  },
  confirmationMessageSentDate: {
    type: Date
  },
  resolution: {
    action: {
      type: String,
      enum: ['item-updated', 'item-removed', 'no-action-needed', 'user-warned']
    },
    note: {
      type: String,
      trim: true
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: {
      type: Date
    }
  },
}, {
  timestamps: true
});

// Index for efficient queries
reportSchema.index({ itemId: 1 });
reportSchema.index({ user: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ reason: 1 });
reportSchema.index({ createdAt: -1 });
reportSchema.index({ priority: 1, status: 1 });

// Middleware to update confirmation message sent date
reportSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'resolved' && !this.confirmationMessageSentDate) {
    this.confirmationMessageSentDate = new Date();
  }
  next();
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
