import express from 'express';
import * as chatController from '../controllers/chat.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticateJwt);

// Send a message and get AI response
router.post('/message', chatController.sendMessage);

// Get conversation history
router.get('/history', chatController.getConversationHistory);

// Get available personas
router.get('/personas', chatController.getPersonas);

export default router;
