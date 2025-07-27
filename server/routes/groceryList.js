import express from 'express';
import GroceryList from '../models/groceryList.js';

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
router.post('/:listId/add-item', async (req, res) => {
  const { listId } = req.params;
  const { itemId } = req.body;

  try {
    const list = await GroceryList.findById(listId);
    if (!list) return res.status(404).json({ message: 'List not found' });

    if (!list.items.includes(itemId)) {
      list.items.push(itemId);
      await list.save();
    }

    res.status(200).json({ message: 'Item added to list', list });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
