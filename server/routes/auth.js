import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // TODO: Implement actual authentication logic
  try {
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(400).json({
        message: 'Login endpoint',
        email: email || '',
        authenticated: false // Placeholder
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Login endpoint',
        email: email || '',
        authenticated: false // Placeholder
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login endpoint',
      email: user.email,
      authenticated: true, // User successfully logged in
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Registration route
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  // TODO: Implement actual registration logic
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'Registration endpoint',
        email: email || '',
        name: name || '',
        registered: false // Placeholder
      });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({
      message: 'Registration endpoint',
      email: newUser.email,
      name: newUser.name,
      registered: true // User successfully registered
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

export default router;
