// User-related types
export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  isAnonymous?: boolean;
  role?: 'user' | 'admin';
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  username: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// Chat-related types
export interface Message {
  id?: string;
  text: string;
  sender: 'user' | 'ai';
  persona?: 'arjuna' | 'maya';
  timestamp?: string | Date;
  isCrisisResponse?: boolean;
}

export interface SendMessageRequest {
  message: string;
  persona: 'arjuna' | 'maya';
}

export interface SendMessageResponse {
  response: string;
  isCrisisResponse: boolean;
  crisisScore?: number;
}

export interface AIPersona {
  id: string;
  name: string;
  description: string;
}

export interface GetPersonasResponse {
  personas: AIPersona[];
}

// Crisis-related types
export interface CrisisHelpline {
  name: string;
  phone: string;
  description: string;
  website?: string;
}

export interface CrisisHelplinesResponse {
  helplines: CrisisHelpline[];
}

// Health-related types
export interface HealthData {
  sleepHours: number[];
  activitySteps: number[];
  moodScores: number[];
  screenTimeHours: number[];
  date: string | Date;
}

// Wellness-related types
export interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  durationSeconds: number;
  steps: BreathingStep[];
}

export interface BreathingStep {
  type: 'inhale' | 'hold' | 'exhale';
  durationSeconds: number;
  instruction: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  mood: 'happy' | 'calm' | 'neutral' | 'sad' | 'anxious';
  timestamp: Date;
}

export interface MoodTracker {
  id: string;
  userId: string;
  mood: 'happy' | 'calm' | 'neutral' | 'sad' | 'anxious';
  timestamp: Date;
  notes?: string;
}

export interface CommunityPost {
  id: string;
  content: string;
  timestamp: Date;
  likeCount: number;
  commentCount: number;
  isAnonymous: boolean;
  userId?: string;
}

// API error response
export interface ErrorResponse {
  error: string;
  details?: any;
}
