import express from 'express';
import GroceryList from '../models/GroceryList.js';
import GroceryItem from '../models/GroceryItem.js';


const router = express.Router();

// GET /api/grocery-lists
router.get('/', async (req, res) => {
  try {
    const lists = await GroceryList.find().populate('items');
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch lists', error: err.message });
  }
});

// POST /api/grocery-lists
router.post('/', async (req, res) => {
  const { name } = req.body;

  try {
    const count = await GroceryList.countDocuments();
    const newList = new GroceryList({
      listName: name || `List ${count + 1}`
    });

    await newList.save();
    res.status(201).json(newList);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create list', error: err.message });
  }
});


// POST /api/grocery-lists/:listId/add-item
router.post('/user/:userId/add-item', async (req, res) => {
  const { userId } = req.params;
  const { itemId } = req.body;

  try {
    // Validate item exists
    const item = await GroceryItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Find or create list
    let list = await GroceryList.findOne({ createdBy: userId });

    if (!list) {
      list = new GroceryList({
        listName: 'My Grocery List',
        createdBy: userId,
        items: [itemId],
      });
    } else {
      if (!list.items.includes(itemId)) {
        list.items.push(itemId);
      }
    }

    await list.save();
    res.status(200).json({ message: 'Item added to list', list });
  } catch (err) {
    console.error('Error adding item to list:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/grocery-lists/:listId/items
router.get('/:listId/items', async (req, res) => {
  const { listId } = req.params;

  try {
    const list = await GroceryList.findById(listId).populate('items');
    if (!list) {
      return res.status(404).json({ message: 'Grocery list not found' });
    }

    res.status(200).json(list.items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch items', error: err.message });
  }
});

export default router;
