import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Middleware to check admin role
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
}

// List users with optional filtering/sorting/pagination
router.get('/users', auth, requireAdmin, async (req, res) => {
  const { q, role, sortBy = 'createdAt', order = 'desc', page = 1, limit = 20 } = req.query;
  const filter = {};
  if (q) filter.name = { $regex: q, $options: 'i' };
  if (role) filter.role = role;

  const users = await User.find(filter)
    .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const total = await User.countDocuments(filter);

  res.json({ success: true, data: { users, total } });
});

// Edit user details (name, email, role)
router.put('/users/:id', auth, requireAdmin, async (req, res) => {
  const { name, email, role } = req.body;
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role },
    { new: true }
  );
  res.json({ success: true, data: updated });
});

// Remove user
router.delete('/users/:id', auth, requireAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted' });
});

// Change user role
router.patch('/users/:id/role', auth, requireAdmin, async (req, res) => {
  const { role } = req.body;
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  );
  res.json({ success: true, data: updated });
});

// Reset user password
router.post('/users/:id/reset-password', auth, requireAdmin, async (req, res) => {
  const { newPassword } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password reset' });
});

export default router;