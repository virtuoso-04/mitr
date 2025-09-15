/**
 * Mitr Design System - Design Tokens
 * 
 * This file defines the core design tokens for the Mitr mental wellness app,
 * following the Emotional-First Design philosophy.
 */

export const colors = {
  // Calming Blues - Reduce anxiety, promote trust
  blue: {
    primary: '#4A90E2',       // Main brand color
    soft: '#E8F4FD',          // Background wash
    deep: '#2C5AA0',          // Headers, emphasis
  },

  // Healing Greens - Growth, nature, balance
  green: {
    healing: '#6BCF7F',       // Success states
    sage: '#A8D5BA',          // Secondary elements
    forest: '#4A7C59',        // Grounding accents
  },

  // Warm Neutrals - Safety, comfort
  neutral: {
    white: '#FEFEFE',         // Pure backgrounds
    cream: '#FBF9F7',         // Soft backgrounds
    gray: '#8E8E93',          // Body text
    charcoal: '#1C1C1E',      // Headlines
  },

  // Accent Colors - Mindful usage
  accent: {
    orange: '#FF9F43',        // Warnings, energy
    lavender: '#B8A9FF',      // Spiritual elements
    rose: '#E8B4B8',          // Gentle highlights
    crisis: '#FF6B6B',        // Only for emergency situations
  },
};

// Design system from wireframes
export const tealPalette = {
  teal100: '#D2ECED',
  teal200: '#A3D6D9',
  teal300: '#6BB7BC',
  teal400: '#2D8A90',
  teal500: '#0B656D',
};

// Typography scale with semantic naming
export const typography = {
  // Font families
  fontFamily: {
    primary: 'Inter, system-ui, sans-serif',
    sanskrit: 'RozhaOne, serif',
  },

  // Font sizes with semantic naming
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    hero: 'clamp(28px, 5vw, 36px)',
  },

  // Font weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.7,
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.01em',
  },

  // Text styles - ready to use combinations
  textStyles: {
    hero: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 'clamp(28px, 5vw, 36px)',
      fontWeight: 600,
      lineHeight: 1.2,
      color: '#1C1C1E', // charcoal
      letterSpacing: '-0.02em',
    },
    heading: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: 1.2,
      color: '#1C1C1E',
    },
    subheading: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '20px',
      fontWeight: 500,
      lineHeight: 1.3,
      color: '#1C1C1E',
    },
    body: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.6,
      color: '#8E8E93', // warm-gray
    },
    gentle: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '14px',
      fontWeight: 300,
      lineHeight: 1.7,
      color: '#8E8E93',
      opacity: 0.8,
    },
    aiResponse: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.6,
      color: '#1C1C1E',
      letterSpacing: '0.01em',
    },
    sanskrit: {
      fontFamily: 'RozhaOne, serif',
      fontSize: '18px',
      fontWeight: 400,
      lineHeight: 1.4,
      color: '#2C5AA0', // deep-blue
      letterSpacing: '0.01em',
    },
  },
};

// Spacing system
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',
};

// Border radius system
export const radius = {
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '20px',
  pill: '9999px',
  circle: '50%',
};

// Shadows
export const shadows = {
  sm: '0 2px 4px rgba(0, 0, 0, 0.05)',
  md: '0 4px 8px rgba(0, 0, 0, 0.1)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.1)',
  xl: '0 16px 32px rgba(0, 0, 0, 0.15)',
  glow: {
    blue: '0 8px 32px rgba(74, 144, 226, 0.3)',
    green: '0 8px 32px rgba(107, 207, 127, 0.3)',
    lavender: '0 8px 32px rgba(184, 169, 255, 0.3)',
  },
};

// Animations and transitions
export const animations = {
  durations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    breathing: '4s',
  },
  easings: {
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    gentle: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  },
  keyframes: {
    gentleBreathe: {
      '0%, 100%': { transform: 'scale(1.0)', opacity: 0.6 },
      '50%': { transform: 'scale(1.05)', opacity: 0.8 },
    },
    activePulse: {
      '0%, 100%': { transform: 'scale(1.1)' },
      '50%': { transform: 'scale(1.2)' },
    },
    thinkingRipples: {
      '0%': { transform: 'scale(1.0) rotate(0deg)' },
      '50%': { transform: 'scale(1.15) rotate(180deg)' },
      '100%': { transform: 'scale(1.0) rotate(360deg)' },
    },
    voiceWaves: {
      '0%, 100%': { transform: 'scale(1.0)', filter: 'brightness(1.0)' },
      '25%': { transform: 'scale(1.1)', filter: 'brightness(1.2)' },
      '75%': { transform: 'scale(1.05)', filter: 'brightness(1.1)' },
    },
    crisisBreathe: {
      '0%, 100%': { transform: 'scale(1.2)', opacity: 0.7 },
      '50%': { transform: 'scale(1.3)', opacity: 1.0 },
    },
  },
};

// Z-index scale
export const zIndex = {
  behind: -1,
  default: 0,
  forward: 1,
  floating: 10,
  modal: 100,
  overlay: 200,
  toast: 300,
};

// Export all design tokens
export const designTokens = {
  colors,
  tealPalette,
  typography,
  spacing,
  radius,
  shadows,
  animations,
  zIndex,
};

export default designTokens;