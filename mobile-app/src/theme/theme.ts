/**
 * Mitr Design System - Theme Implementation
 * 
 * This file extends the design tokens into a complete theme object
 * compatible with React Native and NativeBase.
 */

import { extendTheme } from 'native-base';
import { designTokens } from './designTokens';

// Convert spacing values to numbers for React Native
const createSpacing = () => {
  const spacingValues: Record<string, number> = {};
  Object.entries(designTokens.spacing).forEach(([key, value]) => {
    spacingValues[key] = parseInt(value, 10);
  });
  return spacingValues;
};

// Convert shadow values to React Native compatible shadow props
const createShadows = () => {
  return {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.15,
      shadowRadius: 32,
      elevation: 16,
    },
  };
};

// Map font sizes to React Native compatible values
const createFontSizes = () => {
  const fontSizeValues: Record<string, number> = {};
  Object.entries(designTokens.typography.fontSize).forEach(([key, value]) => {
    // Convert values like '16px' to numbers or handle clamp values
    if (value.includes('clamp')) {
      // For clamp values, use the middle value as a reasonable default
      const match = value.match(/\d+/g);
      if (match && match[1]) {
        const middleValue = match[1];
        fontSizeValues[key] = parseInt(middleValue, 10);
      } else {
        // Fallback if regex match fails
        fontSizeValues[key] = 24; // Default size for hero text
      }
    } else {
      fontSizeValues[key] = parseInt(value, 10);
    }
  });
  return fontSizeValues;
};

// Create the extended theme
export const theme = extendTheme({
  colors: {
    // Primary colors
    primary: {
      50: designTokens.colors.blue.soft,
      100: '#D4E6F9',
      200: '#A9CDF3',
      300: '#7FB5ED',
      400: '#649DE7',
      500: designTokens.colors.blue.primary,
      600: '#3A73B5',
      700: '#2C5AA0',
      800: '#1E3D6B',
      900: '#102035',
    },
    // Secondary colors - teal from wireframes
    secondary: {
      50: designTokens.tealPalette.teal100,
      100: '#BFE5E7',
      200: designTokens.tealPalette.teal200,
      300: '#87CED2',
      400: designTokens.tealPalette.teal300,
      500: '#4DA1A7',
      600: designTokens.tealPalette.teal400,
      700: '#217379',
      800: designTokens.tealPalette.teal500,
      900: '#054851',
    },
    // Success states
    success: {
      50: '#E6F7E9',
      100: '#CCEFD3',
      200: '#B3E7BD',
      300: '#99DFA7',
      400: '#80D791',
      500: designTokens.colors.green.healing,
      600: '#55A665',
      700: '#4A7C59',
      800: '#2E533C',
      900: '#17291E',
    },
    // Error states
    error: {
      50: '#FFEAEA',
      100: '#FFD5D5',
      200: '#FFC0C0',
      300: '#FFABAB',
      400: '#FF9696',
      500: designTokens.colors.accent.crisis,
      600: '#CC5656',
      700: '#994040',
      800: '#662B2B',
      900: '#331515',
    },
    // Warning states
    warning: {
      50: '#FFF5E6',
      100: '#FFEACC',
      200: '#FFE0B3',
      300: '#FFD599',
      400: '#FFCB80',
      500: designTokens.colors.accent.orange,
      600: '#CC7F36',
      700: '#995F28',
      800: '#66401B',
      900: '#33200D',
    },
    // Neutrals
    neutral: {
      50: designTokens.colors.neutral.white,
      100: designTokens.colors.neutral.cream,
      200: '#F0EDE9',
      300: '#E5E1DB',
      400: '#D9D5CD',
      500: '#B0ACA6',
      600: '#9D9992',
      700: designTokens.colors.neutral.gray,
      800: '#5C5C5E',
      900: designTokens.colors.neutral.charcoal,
    },
    // Special accent
    accent: {
      lavender: designTokens.colors.accent.lavender,
      rose: designTokens.colors.accent.rose,
    },
  },

  // Font configuration
  fonts: {
    heading: designTokens.typography.fontFamily.primary,
    body: designTokens.typography.fontFamily.primary,
    mono: 'monospace',
    sanskrit: designTokens.typography.fontFamily.sanskrit,
  },

  // Font sizes
  fontSizes: createFontSizes(),
  
  // Font weights
  fontWeights: designTokens.typography.fontWeight,
  
  // Line heights
  lineHeights: designTokens.typography.lineHeight,
  
  // Letter spacing
  letterSpacings: designTokens.typography.letterSpacing,
  
  // Spacing scale
  space: createSpacing(),
  
  // Border radius
  radii: {
    sm: parseInt(designTokens.radius.sm, 10),
    md: parseInt(designTokens.radius.md, 10),
    lg: parseInt(designTokens.radius.lg, 10),
    xl: parseInt(designTokens.radius.xl, 10),
    pill: 999,
    full: 9999,
  },
  
  // Shadow styles
  shadows: createShadows(),
  
  // Component-specific theming
  components: {
    Button: {
      baseStyle: {
        rounded: "lg",
        _text: { 
          fontWeight: "medium" 
        }
      },
      defaultProps: {
        colorScheme: "primary",
      },
      variants: {
        solid: {
          bg: "primary.500",
          _pressed: {
            bg: "primary.600"
          },
        },
        outline: {
          borderWidth: 1,
          borderColor: "primary.500",
          _text: { 
            color: "primary.500" 
          },
          _pressed: {
            bg: "primary.50"
          },
        },
        ghost: {
          _text: { 
            color: "primary.500" 
          },
          _pressed: {
            bg: "primary.50"
          },
        },
        calm: {
          bg: "blue.soft",
          _text: { 
            color: "blue.deep" 
          },
          _pressed: {
            bg: "blue.100"
          },
        },
        healing: {
          bg: "success.500",
          _text: { 
            color: "neutral.50" 
          },
          _pressed: {
            bg: "success.600"
          },
        },
      },
      sizes: {
        sm: {
          px: 3,
          py: 2,
          _text: {
            fontSize: "sm"
          }
        },
        md: {
          px: 4,
          py: 2.5,
          _text: {
            fontSize: "md"
          }
        },
        lg: {
          px: 6,
          py: 3,
          _text: {
            fontSize: "lg"
          }
        }
      }
    },
    Input: {
      baseStyle: {
        borderRadius: "lg",
        borderWidth: 1,
        borderColor: "neutral.300",
        _focus: {
          borderColor: "primary.500",
          bg: "neutral.50",
        }
      }
    },
    Card: {
      baseStyle: {
        rounded: "xl",
        bg: "neutral.50",
        p: 4,
        shadow: "sm",
      },
      variants: {
        elevated: {
          bg: "neutral.50",
          shadow: "md",
        },
        subtle: {
          bg: "neutral.100",
          shadow: "none",
        },
        outline: {
          bg: "transparent",
          borderWidth: 1,
          borderColor: "neutral.200",
          shadow: "none",
        },
        solid: {
          bg: "primary.500",
          _text: {
            color: "neutral.50"
          }
        }
      }
    },
    Heading: {
      baseStyle: {
        color: "neutral.900",
        fontWeight: "semibold",
        letterSpacing: "tight",
      }
    },
    Text: {
      baseStyle: {
        color: "neutral.700",
        fontSize: "md",
        lineHeight: "normal",
      },
      variants: {
        body: {
          fontSize: "md",
          lineHeight: "relaxed",
          color: "neutral.700",
        },
        subtle: {
          fontSize: "sm",
          color: "neutral.600",
        },
        sanskrit: {
          fontFamily: "sanskrit",
          fontSize: "lg",
          lineHeight: "relaxed",
          color: "primary.700",
          letterSpacing: "wide",
        },
        aiResponse: {
          fontSize: "md",
          lineHeight: "relaxed",
          color: "neutral.900",
          letterSpacing: "wide",
        }
      }
    }
  },
});

// Export both the theme and raw design tokens
export default theme;