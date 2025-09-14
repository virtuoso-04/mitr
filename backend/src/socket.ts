import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from './config';

interface AuthenticatedSocket extends any {
  userId: string;
}

export const setupSocketHandlers = (io: SocketIOServer) => {
  // Middleware for JWT authentication on socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token required'));
    }
    
    try {
      const decoded = jwt.verify(token, JWT_CONFIG.secret) as { userId: string };
      (socket as AuthenticatedSocket).userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });
  
  // Handle connections
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.userId}`);
    
    // Join a user-specific room for targeted messages
    socket.join(`user:${socket.userId}`);
    
    // Handle chat messages
    socket.on('send_message', (data: { message: string; persona: string }) => {
      // This would typically go through the API to process the message
      // and then emit the response back
      
      // Emit typing indicator
      io.to(`user:${socket.userId}`).emit('typing', { isTyping: true });
      
      // Simulate AI response delay (would be replaced with actual API call)
      setTimeout(() => {
        io.to(`user:${socket.userId}`).emit('message_response', {
          message: `Demo response to: ${data.message}`,
          persona: data.persona,
        });
        
        io.to(`user:${socket.userId}`).emit('typing', { isTyping: false });
      }, 1000);
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};
