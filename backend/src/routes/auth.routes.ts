import express from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = express.Router();

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get user profile (protected route)
router.get('/profile', authenticateJwt, authController.getProfile);

export default router;
