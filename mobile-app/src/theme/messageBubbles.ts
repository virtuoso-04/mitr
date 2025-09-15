/**
 * Mitr Design System - Message Bubbles
 * 
 * This file defines the styling for chat message bubbles with different personas
 * as described in the design system.
 */

import { StyleSheet } from 'react-native';
import { designTokens } from './designTokens';

// Base styles for all message bubbles
const baseMessageStyles = {
  padding: parseInt(designTokens.spacing.md, 10),
  borderRadius: parseInt(designTokens.radius.lg, 10),
  maxWidth: '80%' as any, // Type casting for React Native style compatibility
  marginVertical: parseInt(designTokens.spacing.xs, 10),
};

// Base container styles
const baseContainerStyles = {
  flexDirection: 'row' as const,
  marginVertical: parseInt(designTokens.spacing.sm, 10),
  paddingHorizontal: parseInt(designTokens.spacing.md, 10),
};

// Arjuna persona message styles - Calm, Wise, Philosophical
export const arjunaStyles = StyleSheet.create({
  container: {
    ...baseContainerStyles,
    justifyContent: 'flex-start',
  },
  bubble: {
    ...baseMessageStyles,
    backgroundColor: designTokens.colors.blue.soft,
    borderColor: designTokens.colors.blue.primary,
    borderWidth: 1,
    borderBottomLeftRadius: parseInt(designTokens.radius.sm, 10),
  },
  text: {
    fontFamily: designTokens.typography.fontFamily.primary,
    fontSize: parseInt(designTokens.typography.fontSize.md, 10),
    lineHeight: designTokens.typography.lineHeight.relaxed,
    color: designTokens.colors.neutral.charcoal,
  },
  sanskritText: {
    fontFamily: designTokens.typography.fontFamily.sanskrit,
    fontSize: parseInt(designTokens.typography.fontSize.md, 10),
    lineHeight: designTokens.typography.lineHeight.relaxed,
    color: designTokens.colors.blue.deep,
    marginTop: parseInt(designTokens.spacing.sm, 10),
    marginBottom: parseInt(designTokens.spacing.sm, 10),
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: parseInt(designTokens.spacing.sm, 10),
    backgroundColor: designTokens.colors.blue.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  timestamp: {
    fontSize: parseInt(designTokens.typography.fontSize.xs, 10),
    color: designTokens.colors.neutral.gray,
    marginTop: parseInt(designTokens.spacing.xs, 10),
    alignSelf: 'flex-start' as const,
  },
});

// Maya persona message styles - Compassionate, Nurturing, Gentle
export const mayaStyles = StyleSheet.create({
  container: {
    ...baseContainerStyles,
    justifyContent: 'flex-start',
  },
  bubble: {
    ...baseMessageStyles,
    backgroundColor: designTokens.colors.green.sage,
    borderColor: designTokens.colors.green.healing,
    borderWidth: 1,
    borderBottomLeftRadius: parseInt(designTokens.radius.sm, 10),
  },
  text: {
    fontFamily: designTokens.typography.fontFamily.primary,
    fontSize: parseInt(designTokens.typography.fontSize.md, 10),
    lineHeight: designTokens.typography.lineHeight.relaxed,
    color: designTokens.colors.neutral.charcoal,
  },
  sanskritText: {
    fontFamily: designTokens.typography.fontFamily.sanskrit,
    fontSize: parseInt(designTokens.typography.fontSize.md, 10),
    lineHeight: designTokens.typography.lineHeight.relaxed,
    color: designTokens.colors.green.forest,
    marginTop: parseInt(designTokens.spacing.sm, 10),
    marginBottom: parseInt(designTokens.spacing.sm, 10),
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: parseInt(designTokens.spacing.sm, 10),
    backgroundColor: designTokens.colors.green.healing,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  timestamp: {
    fontSize: parseInt(designTokens.typography.fontSize.xs, 10),
    color: designTokens.colors.neutral.gray,
    marginTop: parseInt(designTokens.spacing.xs, 10),
    alignSelf: 'flex-start' as const,
  },
});

// User message styles - Modern, Friendly
export const userStyles = StyleSheet.create({
  container: {
    ...baseContainerStyles,
    justifyContent: 'flex-end',
  },
  bubble: {
    ...baseMessageStyles,
    backgroundColor: designTokens.colors.neutral.white,
    borderColor: designTokens.colors.neutral.gray,
    borderWidth: 0.5,
    borderBottomRightRadius: parseInt(designTokens.radius.sm, 10),
  },
  text: {
    fontFamily: designTokens.typography.fontFamily.primary,
    fontSize: parseInt(designTokens.typography.fontSize.md, 10),
    lineHeight: designTokens.typography.lineHeight.normal,
    color: designTokens.colors.neutral.charcoal,
  },
  timestamp: {
    fontSize: parseInt(designTokens.typography.fontSize.xs, 10),
    color: designTokens.colors.neutral.gray,
    marginTop: parseInt(designTokens.spacing.xs, 10),
    alignSelf: 'flex-end' as const,
  },
});

// Crisis message styles - Urgent, Attention-grabbing
export const crisisStyles = StyleSheet.create({
  container: {
    ...baseContainerStyles,
    justifyContent: 'flex-start',
  },
  bubble: {
    ...baseMessageStyles,
    backgroundColor: '#FFF0F0',
    borderColor: designTokens.colors.accent.crisis,
    borderWidth: 1,
    borderBottomLeftRadius: parseInt(designTokens.radius.sm, 10),
  },
  text: {
    fontFamily: designTokens.typography.fontFamily.primary,
    fontSize: parseInt(designTokens.typography.fontSize.md, 10),
    lineHeight: designTokens.typography.lineHeight.relaxed,
    color: designTokens.colors.neutral.charcoal,
    fontWeight: '500' as const,
  },
  heading: {
    fontFamily: designTokens.typography.fontFamily.primary,
    fontSize: parseInt(designTokens.typography.fontSize.lg, 10),
    fontWeight: '600' as const,
    color: designTokens.colors.accent.crisis,
    marginBottom: parseInt(designTokens.spacing.sm, 10),
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: parseInt(designTokens.spacing.sm, 10),
    backgroundColor: designTokens.colors.accent.crisis,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  timestamp: {
    fontSize: parseInt(designTokens.typography.fontSize.xs, 10),
    color: designTokens.colors.accent.crisis,
    marginTop: parseInt(designTokens.spacing.xs, 10),
    alignSelf: 'flex-start' as const,
  },
});

// System message styles - Neutral, Informative
export const systemStyles = StyleSheet.create({
  container: {
    paddingVertical: parseInt(designTokens.spacing.sm, 10),
    paddingHorizontal: parseInt(designTokens.spacing.lg, 10),
    alignItems: 'center' as const,
  },
  bubble: {
    padding: parseInt(designTokens.spacing.sm, 10),
    borderRadius: parseInt(designTokens.radius.pill, 10),
    backgroundColor: designTokens.colors.neutral.cream,
    maxWidth: '90%',
  },
  text: {
    fontFamily: designTokens.typography.fontFamily.primary,
    fontSize: parseInt(designTokens.typography.fontSize.sm, 10),
    color: designTokens.colors.neutral.gray,
    textAlign: 'center' as const,
  },
});

// Combined message styles object
export const messageStyles = {
  arjuna: arjunaStyles,
  maya: mayaStyles,
  user: userStyles,
  crisis: crisisStyles,
  system: systemStyles,
};

export default messageStyles;