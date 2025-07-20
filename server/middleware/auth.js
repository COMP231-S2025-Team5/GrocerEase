import jwt from 'jsonwebtoken';

// Secret key for JWT verification; use environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware function to protect routes by verifying JWT token
const authMiddleware = (req, res, next) => {
  // Get token from Authorization header
  const token = req.header('Authorization');

  // If no token, deny access
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify token (remove "Bearer " prefix if present)
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);

    // Attach decoded user info (e.g., id, role) to request object
    req.user = decoded;

    // Proceed to next middleware or route handler
    next();
  } catch (err) {
    // If token invalid or expired, deny access
    res.status(400).json({ message: 'Invalid token.' });
  }
};

export default authMiddleware;
