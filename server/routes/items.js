import express from 'express';
import GroceryItem from '../models/GroceryItem.js'; // adjust the path

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await GroceryItem.find(); // no populate
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to retrieve items' });
  }
});

export default router;