import express from 'express';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticateJwt);

// Get user details by ID
router.get('/:id', (req, res) => {
  res.status(200).json({ message: 'User details endpoint (placeholder)' });
});

// Update user profile
router.put('/profile', (req, res) => {
  res.status(200).json({ message: 'Update profile endpoint (placeholder)' });
});

export default router;
