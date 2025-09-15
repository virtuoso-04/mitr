import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/user.model';
import { JWT_CONFIG } from '../config';

// Extended Request type with userId from auth middleware
interface AuthRequest extends Request {
  userId?: string;
}

// Validation schemas using Zod
const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const register = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { username, email, password } = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with that email or username',
      });
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      password, // Will be hashed by mongoose pre-save hook
    });
    
    // Save user to database
    await user.save();
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      JWT_CONFIG.secret,
      { expiresIn: JWT_CONFIG.expiresIn } as SignOptions
    );
    
    // Return user info and token
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        token
      }
    });
  } catch (error: any) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }
    
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message || 'Unknown error occurred'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { email, password } = loginSchema.parse(req.body);
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }
    
    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      JWT_CONFIG.secret,
      { expiresIn: JWT_CONFIG.expiresIn } as SignOptions
    );
    
    // Return user info and token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        token,
      }
    });
  } catch (error: any) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }
    
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message || 'Unknown error occurred'
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    // Find user by ID (from JWT)
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.status(200).json({ 
      success: true,
      message: 'User profile retrieved successfully',
      data: { user }
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message || 'Unknown error occurred'
    });
  }
};
