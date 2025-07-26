import mongoose from 'mongoose';

const groceryListSchema = new mongoose.Schema({
  listId: {
    type: String,
    unique: true,
    trim: true,
  },
  listName: {
    type: String,
    trim: true,
    maxlength: [100, 'List name cannot exceed 100 characters'],
    default: 'List 1'
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GroceryItem',
      required: true
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
});