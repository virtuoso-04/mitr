import express from 'express';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticateJwt);

// Report a crisis situation
router.post('/report', (req, res) => {
  res.status(200).json({ message: 'Crisis report endpoint (placeholder)' });
});

// Get crisis helplines
router.get('/helplines', (req, res) => {
  // Simulated response with crisis helplines for India
  res.status(200).json({
    helplines: [
      {
        name: 'AASRA',
        phone: '91-9820466726',
        description: '24/7 Helpline for people facing mental health issues',
        website: 'http://www.aasra.info/'
      },
      {
        name: 'iCALL',
        phone: '+91-9152987821',
        description: 'Psychosocial helpline by TISS',
        website: 'https://icallhelpline.org/'
      },
      {
        name: 'Vandrevala Foundation',
        phone: '+91-9999666555',
        description: '24/7 Mental Health Helpline',
        website: 'https://www.vandrevalafoundation.com/'
      }
    ]
  });
});

export default router;
