import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';

import { SERVER_CONFIG, DB_CONFIG } from './config';
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import userRoutes from './routes/user.routes';
import crisisRoutes from './routes/crisis.routes';
import { authenticateJwt } from './middleware/auth.middleware';
import { setupSocketHandlers } from './socket';

// Initialize Express app
const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*', // In production, set this to specific origins
    methods: ['GET', 'POST'],
  },
});

// Connect to MongoDB
mongoose
  .connect(DB_CONFIG.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.warn('Continuing without MongoDB for testing purposes...');
    // Don't exit for QA testing
    // process.exit(1);
  });

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan(SERVER_CONFIG.isDev ? 'dev' : 'combined'));

// Add request ID middleware
app.use((req, res, next) => {
  req.id = Date.now().toString();
  next();
});

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Service is running',
    data: {
      status: 'ok',
      environment: SERVER_CONFIG.nodeEnv,
      timestamp: new Date()
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/chat', authenticateJwt, chatRoutes);
app.use('/api/users', authenticateJwt, userRoutes);
app.use('/api/crisis', authenticateJwt, crisisRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false,
    message: 'Internal Server Error',
    error: SERVER_CONFIG.isDev ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Not Found',
    error: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Set up socket handlers
setupSocketHandlers(io);

// Start the server
httpServer.listen(SERVER_CONFIG.port, () => {
  console.log(`Server running on port ${SERVER_CONFIG.port} in ${SERVER_CONFIG.nodeEnv} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // In production, you might want to exit and let the process manager restart
  // process.exit(1);
});

export { app, httpServer, io };
