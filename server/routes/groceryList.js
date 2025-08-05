import express from 'express';
import GroceryList from '../models/GroceryList.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/grocery-lists - Get user's grocery lists (protected)
router.get('/', auth, async (req, res) => {
  try {
    const lists = await GroceryList.find({ createdBy: req.user.userId })
      .populate({
        path: 'items.item',
        select: 'itemName price originalPrice promotion store itemImage unitDetails category dealValidUntil'
      });
    res.status(200).json({ success: true, lists });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch lists', error: err.message });
  }
});

// GET /api/grocery-lists/:listId - Get a specific grocery list (protected)
router.get('/:listId', auth, async (req, res) => {
  const { listId } = req.params;

  try {
    const list = await GroceryList.findOne({ _id: listId, createdBy: req.user.userId })
      .populate('items.item');
    if (!list) {
      return res.status(404).json({ success: false, message: 'Grocery list not found' });
    }

    res.status(200).json({ success: true, list });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch list', error: err.message });
  }
});

// POST /api/grocery-lists/:listId/items - Add item to specific list (protected)
router.post('/:listId/items', auth, async (req, res) => {
  const { listId } = req.params;
  const { itemId, itemName, price, store } = req.body;

  try {
    // Verify the list belongs to the user
    const list = await GroceryList.findOne({ _id: listId, createdBy: req.user.userId });
    if (!list) {
      return res.status(404).json({ success: false, message: 'Grocery list not found' });
    }

    // Check if item already exists in the list
    const existingItem = list.items.find(item => item.item.toString() === itemId);
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.itemName = itemName;
      existingItem.price = price;
      existingItem.store = store;
    } else {
      const newItem = {
        item: itemId,
        quantity: 1,
        itemName: itemName,
        price: price,
        store: store
      };
      list.items.push(newItem);
    }

    await list.save();
    res.status(200).json({ 
      success: true, 
      message: existingItem ? 'Item quantity updated' : 'Item added to list',
      list 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add item to list', error: err.message });
  }
});

// POST /api/grocery-lists - Create new grocery list (protected)
router.post('/', auth, async (req, res) => {
  const { name } = req.body;

  try {
    const userListCount = await GroceryList.countDocuments({ createdBy: req.user.userId });
    const newList = new GroceryList({
      listName: name || `My List ${userListCount + 1}`,
      createdBy: req.user.userId
    });

    await newList.save();
    res.status(201).json({ success: true, list: newList });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create list', error: err.message });
  }
});

// DELETE /api/grocery-lists/:listId - Delete entire list (protected)
router.delete('/:listId', auth, async (req, res) => {
  const { listId } = req.params;

  try {
    // Verify the list belongs to the user
    const list = await GroceryList.findOne({ _id: listId, createdBy: req.user.userId });
    if (!list) {
      return res.status(404).json({ success: false, message: 'Grocery list not found' });
    }

    await GroceryList.findByIdAndDelete(listId);
    res.status(200).json({ success: true, message: 'List deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete list', error: err.message });
  }
});

// DELETE /api/grocery-lists/:listId/remove-item/:itemId - Remove item from list (protected)
router.delete('/:listId/remove-item/:itemId', auth, async (req, res) => {
  const { listId, itemId } = req.params;

  try {
    // Verify the list belongs to the user
    const list = await GroceryList.findOne({ _id: listId, createdBy: req.user.userId });
    if (!list) {
      return res.status(404).json({ success: false, message: 'Grocery list not found' });
    }

    const originalLength = list.items.length;
    list.items = list.items.filter(i => i.item.toString() !== itemId);

    if (list.items.length === originalLength) {
      return res.status(404).json({ success: false, message: 'Item not found in list' });
    }

    await list.save();
    res.status(200).json({ success: true, message: 'Item removed from list' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to remove item', error: err.message });
  }
});

// GET /api/grocery-lists/:listId/items - Get items in a specific list (protected)
router.get('/:listId/items', auth, async (req, res) => {
  const { listId } = req.params;

  try {
    // Verify the list belongs to the user
    const list = await GroceryList.findOne({ _id: listId, createdBy: req.user.userId })
      .populate({
        path: 'items.item',
        select: 'itemName price originalPrice promotion store itemImage unitDetails category dealValidUntil'
      });
    if (!list) {
      return res.status(404).json({ success: false, message: 'Grocery list not found' });
    }

    res.status(200).json(list.items);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch items', error: err.message });
  }
});

// PUT /api/grocery-lists/:listId/update-quantity - Update item quantity (protected)
router.put('/:listId/update-quantity', auth, async (req, res) => {
  const { listId } = req.params;
  const { itemId, quantity } = req.body;

  try {
    // Verify the list belongs to the user
    const list = await GroceryList.findOne({ _id: listId, createdBy: req.user.userId });
    if (!list) {
      return res.status(404).json({ success: false, message: 'Grocery list not found' });
    }

    const entry = list.items.find(i => i.item.toString() === itemId);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Item not found in list' });
    }

    entry.quantity = quantity;
    await list.save();

    res.status(200).json({ success: true, message: 'Quantity updated', itemId, quantity });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update quantity', error: err.message });
  }
});

export default router;
