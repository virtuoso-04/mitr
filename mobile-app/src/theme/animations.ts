/**
 * Mitr Animation System - Core Animations
 * 
 * This file provides reusable animation configurations for the Mitr app,
 * implementing the Siri-style halo and other micro-interactions described
 * in the design system.
 */

import { Animated, Easing } from 'react-native';
import { designTokens } from './designTokens';

// Handle string values with px units
const parsePx = (value: string): number => {
  if (typeof value === 'string' && value.endsWith('px')) {
    return parseInt(value, 10);
  }
  return parseInt(String(value), 10);
};

// Animation timing presets based on design tokens
const timingPresets = {
  fast: parsePx(designTokens.animations.durations.fast),
  normal: parsePx(designTokens.animations.durations.normal),
  slow: parsePx(designTokens.animations.durations.slow),
  breathing: parsePx(designTokens.animations.durations.breathing),
};

// Easing presets based on design tokens
const easingPresets = {
  easeOut: Easing.bezier(0.0, 0, 0.2, 1), // Matches the design token cubic-bezier
  easeIn: Easing.bezier(0.4, 0, 1, 1),
  easeInOut: Easing.bezier(0.4, 0, 0.2, 1),
  gentle: Easing.bezier(0.4, 0.0, 0.2, 1),
};

// Types for animation options
interface HaloAnimationOptions {
  duration?: number;
  minScale?: number;
  maxScale?: number;
  minOpacity?: number;
  maxOpacity?: number;
  easing?: any;
  autoStart?: boolean;
}

interface ThinkingAnimationOptions {
  duration?: number;
  minScale?: number;
  maxScale?: number;
  rotations?: number;
  easing?: any;
  autoStart?: boolean;
}

interface VoiceWaveAnimationOptions {
  duration?: number;
  minScale?: number;
  maxScale?: number;
  minBrightness?: number;
  maxBrightness?: number;
  easing?: any;
  autoStart?: boolean;
}

interface CrisisAnimationOptions {
  duration?: number;
  minScale?: number;
  maxScale?: number;
  minOpacity?: number;
  maxOpacity?: number;
  easing?: any;
  autoStart?: boolean;
}

interface PressAnimationOptions {
  duration?: number;
  pressedScale?: number;
  easing?: any;
}

/**
 * Creates a pulsing animation for the AI assistant halo
 * @param {Animated.Value} animatedValue - The animated value to drive the animation
 * @param {HaloAnimationOptions} options - Animation configuration options
 * @returns {object} Animation controls and values
 */
export const createHaloAnimation = (
  animatedValue = new Animated.Value(0),
  options: HaloAnimationOptions = {}
) => {
  const {
    duration = timingPresets.breathing,
    minScale = 1.0,
    maxScale = 1.05,
    minOpacity = 0.6,
    maxOpacity = 0.8,
    easing = easingPresets.gentle,
    autoStart = true,
  } = options;

  // Create the main animation sequence
  const animate = () => {
    // Reset the value
    animatedValue.setValue(0);
    
    // Create an animated sequence that loops
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        easing,
        useNativeDriver: true,
      })
    ).start();
  };

  // Interpolate the scale and opacity values
  const scale = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [minScale, maxScale, minScale],
  });
  
  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [minOpacity, maxOpacity, minOpacity],
  });

  // Start animation if autoStart is true
  if (autoStart) {
    animate();
  }

  return {
    animate,
    stop: () => animatedValue.stopAnimation(),
    scale,
    opacity,
    animatedValue,
  };
};

/**
 * Creates a thinking animation for the AI processing state
 * Similar to Siri's animation when processing
 */
export const createThinkingAnimation = (
  animatedValue = new Animated.Value(0),
  options: ThinkingAnimationOptions = {}
) => {
  const {
    duration = timingPresets.slow,
    minScale = 1.0,
    maxScale = 1.15,
    rotations = 1,
    easing = easingPresets.easeInOut,
    autoStart = true,
  } = options;

  // Create the main animation sequence for thinking state
  const animate = () => {
    // Reset the value
    animatedValue.setValue(0);
    
    // Create an animated sequence that loops
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        easing,
        useNativeDriver: true,
      })
    ).start();
  };

  // Interpolate the scale and rotation values
  const scale = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [minScale, maxScale, minScale],
  });
  
  const rotate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${360 * rotations}deg`],
  });

  // Start animation if autoStart is true
  if (autoStart) {
    animate();
  }

  return {
    animate,
    stop: () => animatedValue.stopAnimation(),
    scale,
    rotate,
    animatedValue,
  };
};

/**
 * Creates a voice wave animation for the speech input
 */
export const createVoiceWaveAnimation = (
  animatedValue = new Animated.Value(0),
  options: VoiceWaveAnimationOptions = {}
) => {
  const {
    duration = timingPresets.normal,
    minScale = 1.0,
    maxScale = 1.1,
    minBrightness = 1.0,
    maxBrightness = 1.2,
    easing = easingPresets.easeInOut,
    autoStart = true,
  } = options;

  // Create the main animation sequence
  const animate = () => {
    // Reset the value
    animatedValue.setValue(0);
    
    // Create an animated sequence that loops
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        easing,
        useNativeDriver: false, // Need native driver false for brightness filter
      })
    ).start();
  };

  // Interpolate the scale value
  const scale = animatedValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [minScale, maxScale, 1.05, maxScale, minScale],
  });
  
  // Interpolate the brightness value for filter
  const brightness = animatedValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [minBrightness, maxBrightness, 1.1, maxBrightness, minBrightness],
  });

  // Start animation if autoStart is true
  if (autoStart) {
    animate();
  }

  return {
    animate,
    stop: () => animatedValue.stopAnimation(),
    scale,
    brightness,
    animatedValue,
  };
};

/**
 * Creates a crisis pulse animation for emergency situations
 */
export const createCrisisAnimation = (
  animatedValue = new Animated.Value(0),
  options: CrisisAnimationOptions = {}
) => {
  const {
    duration = timingPresets.fast,
    minScale = 1.2,
    maxScale = 1.3,
    minOpacity = 0.7,
    maxOpacity = 1.0,
    easing = easingPresets.easeOut,
    autoStart = true,
  } = options;

  // Create the main animation sequence
  const animate = () => {
    // Reset the value
    animatedValue.setValue(0);
    
    // Create an animated sequence that loops
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        easing,
        useNativeDriver: true,
      })
    ).start();
  };

  // Interpolate the scale and opacity values
  const scale = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [minScale, maxScale, minScale],
  });
  
  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [minOpacity, maxOpacity, minOpacity],
  });

  // Start animation if autoStart is true
  if (autoStart) {
    animate();
  }

  return {
    animate,
    stop: () => animatedValue.stopAnimation(),
    scale,
    opacity,
    animatedValue,
  };
};

/**
 * Creates a button press animation for feedback
 */
export const createPressAnimation = (
  animatedValue = new Animated.Value(1),
  options: PressAnimationOptions = {}
) => {
  const {
    duration = timingPresets.fast,
    pressedScale = 0.96,
    easing = easingPresets.easeOut,
  } = options;

  // Animation for button press
  const pressIn = () => {
    Animated.timing(animatedValue, {
      toValue: pressedScale,
      duration,
      easing,
      useNativeDriver: true,
    }).start();
  };

  // Animation for button release
  const pressOut = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      easing,
      useNativeDriver: true,
    }).start();
  };

  return {
    pressIn,
    pressOut,
    scale: animatedValue,
  };
};

export default {
  createHaloAnimation,
  createThinkingAnimation,
  createVoiceWaveAnimation,
  createCrisisAnimation,
  createPressAnimation,
  timingPresets,
  easingPresets,
};