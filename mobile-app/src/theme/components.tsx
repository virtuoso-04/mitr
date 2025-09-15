/**
 * Mitr Design System - UI Components
 * 
 * This file provides reusable UI components styled according to the 
 * Mitr design system.
 */

import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Box, Button, Heading, VStack, HStack } from 'native-base';
import { designTokens } from './designTokens';
import animations from './animations';

// ------------------------------
// AI Assistant Halo Component
// ------------------------------

interface HaloProps {
  size?: number;
  color?: string;
  isThinking?: boolean;
  isSpeaking?: boolean;
  isCrisis?: boolean;
}

export const AssistantHalo: React.FC<HaloProps> = ({
  size = 60,
  color = designTokens.colors.blue.primary,
  isThinking = false,
  isSpeaking = false,
  isCrisis = false,
}) => {
  // Setup animation values
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const animation = React.useRef<any>(null);
  
  React.useEffect(() => {
    // Determine which animation to use
    if (isThinking) {
      animation.current = animations.createThinkingAnimation(animatedValue);
    } else if (isSpeaking) {
      animation.current = animations.createVoiceWaveAnimation(animatedValue);
    } else if (isCrisis) {
      animation.current = animations.createCrisisAnimation(animatedValue, {
        duration: 800,
        minScale: 1.0,
        maxScale: 1.2,
        minOpacity: 0.7,
        maxOpacity: 1.0,
      });
    } else {
      animation.current = animations.createHaloAnimation(animatedValue);
    }
    
    // Cleanup animation on unmount
    return () => {
      if (animation.current && animation.current.stop) {
        animation.current.stop();
      }
    };
  }, [isThinking, isSpeaking, isCrisis, animatedValue]);
  
  // Get animation styles
  const getAnimationStyles = () => {
    if (!animation.current) return {};
    
    const scaleStyle = { transform: [{ scale: animation.current.scale || 1 }] };
    const opacityStyle = animation.current.opacity ? { opacity: animation.current.opacity } : {};
    const rotateStyle = animation.current.rotate ? { transform: [{ rotate: animation.current.rotate }] } : {};
    
    // Combine transform arrays if both scale and rotate exist
    if (animation.current.scale && animation.current.rotate) {
      return {
        transform: [
          { scale: animation.current.scale },
          { rotate: animation.current.rotate },
        ],
        ...opacityStyle,
      };
    }
    
    return {
      ...scaleStyle,
      ...opacityStyle,
      ...rotateStyle,
    };
  };
  
  // Determine which color to use based on mode
  const getHaloColor = () => {
    if (isCrisis) return designTokens.colors.accent.crisis;
    if (isThinking) return designTokens.colors.accent.lavender;
    if (isSpeaking) return designTokens.colors.green.healing;
    return color;
  };

  return (
    <View style={styles.haloContainer}>
      <Animated.View
        style={[
          styles.halo,
          {
            width: size * 2,
            height: size * 2,
            borderRadius: size,
            backgroundColor: getHaloColor() + '20', // Add transparency
          },
          getAnimationStyles(),
        ]}
      />
      <Animated.View
        style={[
          styles.halo,
          {
            width: size * 1.5,
            height: size * 1.5,
            borderRadius: size * 0.75,
            backgroundColor: getHaloColor() + '40', // More opaque
          },
          getAnimationStyles(),
        ]}
      />
      <Animated.View
        style={[
          styles.haloCore,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: getHaloColor(),
          },
        ]}
      />
    </View>
  );
};

// ------------------------------
// Message Input Component
// ------------------------------

interface MessageInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  isRecording?: boolean;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChangeText,
  onSend,
  isRecording = false,
  onStartRecording,
  onStopRecording,
  placeholder = 'Type a message...',
}) => {
  // Send button animation
  const sendButtonScale = React.useRef(new Animated.Value(1)).current;
  const sendButtonAnimation = animations.createPressAnimation(sendButtonScale);
  
  // Record button animation
  const recordButtonScale = React.useRef(new Animated.Value(1)).current;
  const recordButtonAnimation = animations.createPressAnimation(recordButtonScale);
  
  // Whether the send button should be shown (when text exists)
  const showSendButton = value.trim().length > 0;

  return (
    <Box bg="neutral.50" py={2} px={4} borderTopWidth={1} borderTopColor="neutral.200">
      <HStack space={2} alignItems="center">
        {/* Text Input */}
        <Box flex={1} bg="neutral.100" borderRadius="xl" px={4} py={2}>
          {/* Replace with proper TextInput from react-native */}
          <Text>{placeholder}</Text>
        </Box>
        
        {/* Send/Record Button */}
        {showSendButton ? (
          <TouchableOpacity
            onPress={onSend}
            onPressIn={sendButtonAnimation.pressIn}
            onPressOut={sendButtonAnimation.pressOut}
          >
            <Animated.View
              style={[
                styles.sendButton,
                { transform: [{ scale: sendButtonScale }] },
              ]}
            >
              <Text style={styles.sendButtonText}>➤</Text>
            </Animated.View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={isRecording ? onStopRecording : onStartRecording}
            onPressIn={recordButtonAnimation.pressIn}
            onPressOut={recordButtonAnimation.pressOut}
          >
            <Animated.View
              style={[
                styles.recordButton,
                { 
                  backgroundColor: isRecording ? 
                    designTokens.colors.accent.crisis : 
                    designTokens.colors.blue.primary,
                  transform: [{ scale: recordButtonScale }],
                },
              ]}
            >
              <Text style={styles.recordButtonText}>🎙</Text>
            </Animated.View>
          </TouchableOpacity>
        )}
      </HStack>
    </Box>
  );
};

// ------------------------------
// Breathing Exercise Component
// ------------------------------

interface BreathingExerciseProps {
  onComplete?: () => void;
  duration?: number;
  cycles?: number;
}

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({
  onComplete,
  duration = 4000,
  cycles = 5,
}) => {
  const [currentCycle, setCurrentCycle] = React.useState(0);
  const [status, setStatus] = React.useState<'inhale' | 'hold' | 'exhale' | 'complete'>('inhale');
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  
  // Create animation sequence
  React.useEffect(() => {
    if (status === 'complete') {
      onComplete && onComplete();
      return;
    }
    
    // Animation sequence for breathing
    let animation: Animated.CompositeAnimation | null = null;
    
    if (status === 'inhale') {
      // Inhale animation (expand)
      animation = Animated.timing(animatedValue, {
        toValue: 1,
        duration: duration,
        useNativeDriver: true,
      });
      
      animation.start(() => {
        setStatus('hold');
      });
    } else if (status === 'hold') {
      // Hold animation (pause)
      animation = Animated.delay(duration / 2);
      
      animation.start(() => {
        setStatus('exhale');
      });
    } else if (status === 'exhale') {
      // Exhale animation (contract)
      animation = Animated.timing(animatedValue, {
        toValue: 0,
        duration: duration,
        useNativeDriver: true,
      });
      
      animation.start(() => {
        if (currentCycle < cycles - 1) {
          setCurrentCycle(currentCycle + 1);
          setStatus('inhale');
        } else {
          setStatus('complete');
        }
      });
    }
    
    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [status, currentCycle, animatedValue, duration, cycles, onComplete]);
  
  // Interpolate size and opacity
  const circleSize = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 220],
  });
  
  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 0.7, 0.9],
  });

  return (
    <VStack space={4} alignItems="center" p={4}>
      <Heading size="md">
        {status === 'inhale' ? 'Inhale...' : 
         status === 'hold' ? 'Hold...' :
         status === 'exhale' ? 'Exhale...' : 
         'Complete'}
      </Heading>
      
      <Text>Cycle {currentCycle + 1} of {cycles}</Text>
      
      <View style={styles.breathingExerciseContainer}>
        <Animated.View
          style={[
            styles.breathingCircle,
            {
              width: circleSize,
              height: circleSize,
              opacity: opacity,
              backgroundColor: 
                status === 'inhale' ? designTokens.colors.blue.primary :
                status === 'hold' ? designTokens.colors.accent.lavender :
                status === 'exhale' ? designTokens.colors.green.healing :
                designTokens.colors.neutral.gray,
            },
          ]}
        />
      </View>
    </VStack>
  );
};

// ------------------------------
// Styles
// ------------------------------

const styles = StyleSheet.create({
  haloContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  haloCore: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: designTokens.colors.blue.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
  },
  recordButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonText: {
    color: 'white',
    fontSize: 18,
  },
  breathingExerciseContainer: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  breathingCircle: {
    borderRadius: 9999,
  },
});

export default {
  AssistantHalo,
  MessageInput,
  BreathingExercise,
};