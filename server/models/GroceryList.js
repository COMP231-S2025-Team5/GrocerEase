import mongoose from 'mongoose';

const groceryListSchema = new mongoose.Schema({
  listName: {
    type: String,
    trim: true,
    maxlength: [100, 'List name cannot exceed 100 characters'],
    default: 'List 1'
  },
  items: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GroceryItem',
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
    },
    itemName: {
      type: String,
      required: false
    },
    price: {
      type: Number,
      required: false
    },
    store: {
      type: String,
      required: false
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const GroceryList = mongoose.model('GroceryList', groceryListSchema, 'lists');

export default GroceryList;
