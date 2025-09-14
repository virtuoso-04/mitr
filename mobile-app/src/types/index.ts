// User-related types
export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  createdAt?: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Chat-related types
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  persona?: 'arjuna' | 'maya';
  timestamp: Date;
  isLoading?: boolean;
  isCrisisResponse?: boolean;
}

export interface AIPersona {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string;
}

// Health monitoring types
export interface HealthData {
  sleepHours: number[];
  activitySteps: number[];
  moodScores: number[];
  screenTimeHours: number[];
  date: Date;
}

// Community-related types
export interface CommunityPost {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  isAnonymous: boolean;
  likes: number;
  comments: number;
  createdAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  isAnonymous: boolean;
  createdAt: Date;
}

// Wellness tools types
export interface JournalEntry {
  id: string;
  content: string;
  mood: number;
  tags: string[];
  createdAt: Date;
}

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

// Gamification types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  isCompleted: boolean;
  category: 'wellness' | 'social' | 'mindfulness' | 'activity';
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  isRedeemed: boolean;
}
