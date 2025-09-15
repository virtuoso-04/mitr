/**
 * Mitr Design System - Index Export
 * 
 * This file exports all design system components for easy importing
 * throughout the application.
 */

// Export design tokens
export { default as designTokens } from './designTokens';

// Export theme
export { default as theme } from './theme';

// Export animations
export { default as animations } from './animations';
export * from './animations';

// Export message bubbles
export { default as messageStyles } from './messageBubbles';
export * from './messageBubbles';

// Export UI components
export { default as components } from './components';
export * from './components';

// Consolidated export
export default {
  designTokens,
  theme,
  animations,
  messageStyles,
  components,
};

import designTokens from './designTokens';
import theme from './theme';
import animations from './animations';
import messageStyles from './messageBubbles';
import components from './components';