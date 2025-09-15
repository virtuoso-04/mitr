import { Request, Response } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import Conversation from '../models/conversation.model';
import aiService from '../services/ai.service';

// Type definitions for improved type safety
interface GitaVerseContent {
  sanskrit: string;
  citation: string;
  translation: string;
  explanation?: string;
}

// Validation schemas
const sendMessageSchema = z.object({
  message: z.string().min(1).max(1000),
  persona: z.enum(['arjuna', 'maya']),
});

// Send a message to the AI and get a response
export const sendMessage = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { message, persona } = sendMessageSchema.parse(req.body);
    
    if (!req.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Check for crisis indicators
    const crisisCheck = await aiService.detectCrisis(message);
    
    // Find or create conversation
    let conversation = await Conversation.findOne({ userId: req.userId });
    
    if (!conversation) {
      conversation = new Conversation({
        userId: new mongoose.Types.ObjectId(req.userId),
        messages: [],
      });
    }
    
    // Add user message to conversation
    const userMessageData = {
      text: message,
      sender: 'user' as const
    };
    conversation.messages.push(userMessageData as any);
    
    // Generate AI response
    let aiResponse;
    let hasGitaVerse = false;
    let gitaVerseData: GitaVerseContent | null = null;
    
    if (crisisCheck.isCrisis) {
      // Special handling for crisis situations
      aiResponse = "I notice you might be going through a difficult time. Remember that help is available, and you're not alone. Would you like me to connect you with a mental health professional or a crisis helpline? Your wellbeing is important.";
      
      // Add AI response to conversation with crisis flag
      const crisisMessageData = {
        text: aiResponse,
        sender: 'ai' as const,
        persona,
        isCrisisResponse: true
      };
      conversation.messages.push(crisisMessageData as any);
      
      // TODO: In a production system, we might trigger additional actions here
      // such as notifications to mental health professionals
    } else {
      // Normal conversation flow
      const chatHistory = conversation.messages
        .slice(-10) // Get last 10 messages for context
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model' as 'user' | 'model',
          parts: msg.text,
        }));
      
      // Create initial values
      let aiResponseObj = null;
      let hasError = false;
      
      try {
        aiResponseObj = await aiService.generateResponse(message, persona, chatHistory);
        aiResponse = aiResponseObj.text;
      } catch (aiError) {
        console.error('AI Service error:', aiError);
        // Provide fallback response in case of AI service failure
        aiResponse = "I'm having trouble processing your request right now. Please try again in a moment.";
        // Log detailed error for monitoring
        console.error(`AI Error details: User ${req.userId}, Message: "${message}"`);
        hasError = true;
      }

      // Create message data object
      const messageData: Record<string, any> = {
        text: aiResponse,
        sender: 'ai' as const,
        persona
      };
      
      // Add Gita verse if available and no errors occurred
      if (!hasError && aiResponseObj && aiResponseObj.gitaVerse) {
        hasGitaVerse = true;
        gitaVerseData = {
          sanskrit: aiResponseObj.gitaVerse.sanskrit,
          citation: aiResponseObj.gitaVerse.citation,
          translation: aiResponseObj.gitaVerse.translation
        };
        
        if (aiResponseObj.gitaVerse.explanation) {
          gitaVerseData.explanation = aiResponseObj.gitaVerse.explanation;
        }
        
        messageData.gitaVerse = gitaVerseData;
      }      // Add AI response to conversation
      conversation.messages.push(messageData as any);
    }
    
    // Update last active timestamp
    conversation.lastActive = new Date();
    
    // Save conversation to database
    await conversation.save();
    
    // Prepare standardized response object
    const responseData = {
      success: true,
      message: crisisCheck.isCrisis ? 'Crisis support activated' : 'Response generated successfully',
      data: {
        response: aiResponse,
        isCrisisResponse: crisisCheck.isCrisis,
        crisisScore: crisisCheck.score
      }
    };
    
    // Add Gita verse if available and not in crisis mode
    if (!crisisCheck.isCrisis && hasGitaVerse && gitaVerseData) {
      (responseData.data as any).gitaVerse = gitaVerseData;
    }
    
    // Return the standardized response
    res.status(200).json(responseData);
  } catch (error: any) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }
    
    console.error('Error sending message:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message || 'Unknown error occurred'
    });
  }
};

// Get conversation history
export const getConversationHistory = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }
    
    // Get conversation history for the user
    const conversation = await Conversation.findOne({ userId: req.userId });
    
    if (!conversation) {
      return res.status(200).json({ 
        success: true,
        message: 'No conversation history found',
        data: { messages: [] }
      });
    }
    
    // Return conversation messages
    res.status(200).json({
      success: true,
      message: 'Conversation history retrieved successfully',
      data: {
        messages: conversation.messages,
      }
    });
  } catch (error: any) {
    console.error('Error getting conversation history:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message || 'Unknown error occurred'
    });
  }
};

// Get available personas
export const getPersonas = async (_req: Request, res: Response) => {
  try {
    const personas = [
      {
        id: 'arjuna',
        name: 'Arjuna',
        description: 'Spiritual guide inspired by the Bhagavad Gita',
      },
      {
        id: 'maya',
        name: 'Maya',
        description: 'Modern companion for daily challenges',
      },
    ];
    
    res.status(200).json({
      success: true,
      message: 'Personas retrieved successfully',
      data: { personas }
    });
  } catch (error: any) {
    console.error('Error getting personas:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message || 'Unknown error occurred'
    });
  }
};
