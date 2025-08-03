import express from 'express';
import GroceryList from '../models/GroceryList.js';
import GroceryItem from '../models/GroceryItem.js';


const router = express.Router();

// GET /api/grocery-lists
router.get('/', async (req, res) => {
  try {
    const lists = await GroceryList.find().populate('items.item');
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

// DELETE /api/grocery-lists/:listId
router.delete('/:listId/remove-item/:itemId', async (req, res) => {
  const { listId, itemId } = req.params;

  try {
    const list = await GroceryList.findById(listId);
    if (!list) return res.status(404).json({ message: 'List not found' });

    const originalLength = list.items.length;
    list.items = list.items.filter(i => i.item.toString() !== itemId);

    if (list.items.length === originalLength) {
      return res.status(404).json({ message: 'Item not found in list' });
    }

    await list.save();
    res.status(200).json({ message: 'Item removed from list' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove item', error: err.message });
  }
});


// POST /api/grocery-lists/:listId/add-item
router.post('/user/:userId/add-item', async (req, res) => {
  const { userId } = req.params;
  const { itemId } = req.body;

  try {
    const item = await GroceryItem.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    let list = await GroceryList.findOne({ createdBy: userId });

    if (!list) {
      list = new GroceryList({
        listName: 'My Grocery List',
        createdBy: userId,
        items: [{ item: itemId, quantity: 1 }]
      });
    } else {
      const existing = list.items.find(i => i.item.toString() === itemId);
      if (existing) {
        existing.quantity += 1;
      } else {
        list.items.push({ item: itemId, quantity: 1 });
      }
    }

    await list.save();
    res.status(200).json({ message: 'Item added/updated', list });
  } catch (err) {
    console.error('Error adding item:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/grocery-lists/:listId/items
router.get('/:listId/items', async (req, res) => {
  const { listId } = req.params;

  try {
    const list = await GroceryList.findById(listId).populate('items.item');
    if (!list) {
      return res.status(404).json({ message: 'Grocery list not found' });
    }

    res.status(200).json(list.items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch items', error: err.message });
  }
});

router.put('/:listId/update-quantity', async (req, res) => {
  const { listId } = req.params;
  const { itemId, quantity } = req.body;

  try {
    const list = await GroceryList.findById(listId);
    if (!list) return res.status(404).json({ message: 'List not found' });

    const entry = list.items.find(i => i.item.toString() === itemId);
    if (!entry) return res.status(404).json({ message: 'Item not found in list' });

    entry.quantity = quantity;
    await list.save();

    res.status(200).json({ message: 'Quantity updated', itemId, quantity });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update quantity', error: err.message });
  }
});

export default router;
