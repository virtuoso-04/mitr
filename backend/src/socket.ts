import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from './config';

interface AuthenticatedSocket extends Socket {
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
      const decoded = jwt.verify(token, JWT_CONFIG.secret);
      
      // Check if decoded has the expected structure
      if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
        (socket as unknown as AuthenticatedSocket).userId = (decoded as { userId: string }).userId;
        next();
      } else {
        throw new Error('Invalid token structure');
      }
    } catch (error: any) {
      console.error('Socket authentication error:', error.message);
      next(new Error('Authentication error: Invalid token'));
    }
  });
  
  // Handle connections
  io.on('connection', (socket) => {
    const authSocket = socket as AuthenticatedSocket;
    console.log(`User connected: ${authSocket.userId}`);
    
    // Join a user-specific room for targeted messages
    authSocket.join(`user:${authSocket.userId}`);
    
    // Handle chat messages
    authSocket.on('send_message', (data: { message: string; persona: string }) => {
      // This would typically go through the API to process the message
      // and then emit the response back
      
      // Emit typing indicator
      io.to(`user:${authSocket.userId}`).emit('typing', { isTyping: true });
      
      // Simulate AI response delay (would be replaced with actual API call)
      // In production, this would make a call to the chat controller
      setTimeout(() => {
        // Sample response with potential Gita verse
        const responseData = {
          message: `Demo response to: ${data.message}`,
          persona: data.persona,
          gitaVerse: data.message.toLowerCase().includes('purpose') || 
                    data.message.toLowerCase().includes('meaning') ? {
            sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
            citation: "Bhagavad Gita Chapter 2, Verse 47",
            translation: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
            explanation: "Focus on the present action without attachment to results."
          } : undefined
        };
        
        io.to(`user:${authSocket.userId}`).emit('message_response', responseData);
        io.to(`user:${authSocket.userId}`).emit('typing', { isTyping: false });
      }, 1000);
    });
    
    // Handle disconnect
    authSocket.on('disconnect', () => {
      console.log(`User disconnected: ${authSocket.userId}`);
    });
  });
};
