import { extendTheme } from 'native-base';
import { Dimensions } from 'react-native';

// Get device dimensions
const { width, height } = Dimensions.get('window');

// Device type detection
const isSmallDevice = width < 375;
const isIPhone14Plus = (width === 390 || width === 428) && (height === 844 || height === 926);
const isTablet = width > 768;

// Responsive theme utilities
export const deviceUtils = {
  isSmallDevice,
  isIPhone14Plus,
  isTablet,
  width,
  height,
  // Responsive sizing helper
  rs: (size: number, factor = 0.5) => {
    return isSmallDevice ? size * (1 - factor * 0.2) : 
           isTablet ? size * (1 + factor) : 
           size;
  }
};

const theme = extendTheme({
  colors: {
    primary: {
      50: '#e6f2ff',
      100: '#b3d9ff',
      200: '#80bfff',
      300: '#4da6ff',
      400: '#1a8cff',
      500: '#0073e6',
      600: '#005cb3',
      700: '#004480',
      800: '#002d4d',
      900: '#00171a',
    },
    secondary: {
      50: '#f0f4f8',
      100: '#d9e2ec',
      200: '#bcccdc',
      300: '#9fb3c8',
      400: '#829ab1',
      500: '#627d98',
      600: '#486581',
      700: '#334e68',
      800: '#243b53',
      900: '#102a43',
    },
  },
  fontConfig: {
    Poppins: {
      300: {
        normal: 'Poppins-Light',
      },
      400: {
        normal: 'Poppins-Regular',
      },
      500: {
        normal: 'Poppins-Medium',
      },
      600: {
        normal: 'Poppins-SemiBold',
      },
      700: {
        normal: 'Poppins-Bold',
      },
    },
  },
  fonts: {
    heading: 'Poppins',
    body: 'Poppins',
    mono: 'Poppins',
  },
  config: {
    initialColorMode: 'light',
  },
});

export default theme;
