import mongoose from 'mongoose';

const groceryListSchema = new mongoose.Schema({
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

const GroceryList = mongoose.model('GroceryList', groceryListSchema, 'lists');

export default GroceryList;
