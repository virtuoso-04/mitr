import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      id: string; // Request ID
    }
  }
}

/**
 * Middleware to validate JWT token and set userId on request object
 */
export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_CONFIG.secret);
    
    // Check if decoded has the expected structure
    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
      req.userId = (decoded as { userId: string }).userId;
      next();
    } else {
      throw new Error('Invalid token structure');
    }
  } catch (error: any) {
    console.error('Token verification error:', error.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Middleware to ensure user has admin role
 * Only to be used after authenticateJwt
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  // This would typically check the user's role in database
  // For demo purposes, we're using a placeholder implementation
  if (req.userId !== 'admin-user-id') {
    return res.status(403).json({ error: 'Access denied. Requires admin privileges.' });
  }
  
  next();
};
