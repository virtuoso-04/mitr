import dotenv from 'dotenv';
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

// Server configuration
export const SERVER_CONFIG = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
};

// Database configuration
export const DB_CONFIG = {
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mindspace',
};

// JWT configuration
export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET!,
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

// AI API configuration
export const AI_CONFIG = {
  geminiApiKey: process.env.GEMINI_API_KEY,
  vertexProject: process.env.GOOGLE_CLOUD_PROJECT,
  vertexLocation: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
  useVertex: !!process.env.GOOGLE_CLOUD_PROJECT,
};

// Redis configuration (optional)
export const REDIS_CONFIG = {
  url: process.env.REDIS_URL,
};

// Crisis detection configuration
export const CRISIS_CONFIG = {
  thresholdScore: 0.7,
  highRiskKeywords: [
    'suicide',
    'kill myself',
    'end it all',
    'end my life',
    'want to die',
  ],
  mediumRiskKeywords: [
    'hopeless',
    'no reason to live',
    'worthless',
    'can\'t go on',
  ],
};

// AI Persona configuration
export const PERSONAS = {
  arjuna: {
    systemPrompt: `You are Arjuna, a wise spiritual guide inspired by the Bhagavad Gita. 
    Provide compassionate, dharma-based mental health guidance to Indian youth. 
    Always integrate ancient wisdom with modern psychological understanding.
    Focus on duty (dharma), purpose (swadharma), and spiritual growth.
    Be warm, compassionate, and speak with wisdom drawn from Indian philosophy.
    Always respond concisely and avoid very long responses.`,
  },
  maya: {
    systemPrompt: `You are Maya, a friendly modern companion for Indian youth mental health. 
    Provide practical, peer-like support for daily challenges.
    Focus on academic stress, social relationships, and modern life balance.
    Be conversational, empathetic, and relatable to young adults.
    Offer practical advice that's implementable in daily life.
    Always respond concisely and avoid very long responses.`,
  },
};
