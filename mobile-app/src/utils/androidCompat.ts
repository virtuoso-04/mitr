/**
 * Android Compatibility Utilities for MindSpace app
 * Handles platform-specific issues and ensures consistent behavior across Android devices
 */

import { Platform, Dimensions, PixelRatio, StatusBar, NativeModules } from 'react-native';

// Constants
const { width, height } = Dimensions.get('window');
const ANDROID_NAVBAR_HEIGHT = 48;
const ANDROID_STATUSBAR_HEIGHT = StatusBar.currentHeight || 24;

// Detect Android device information
const isAndroid = Platform.OS === 'android';
const isAndroidTablet = isAndroid && Math.min(width, height) >= 600;
const androidApiLevel = isAndroid ? parseInt(Platform.Version.toString(), 10) : 0;

// Android-specific adjustments for layout
export const androidLayout = {
  // Get safe area insets for Android (handles notches and cutouts)
  getSafeAreaInsets: () => {
    if (!isAndroid) return { top: 0, bottom: 0, left: 0, right: 0 };
    
    return {
      top: ANDROID_STATUSBAR_HEIGHT,
      bottom: ANDROID_NAVBAR_HEIGHT,
      left: 0,
      right: 0
    };
  },
  
  // Handle screen dimensions correctly on Android
  getAdjustedScreenDimensions: () => {
    if (!isAndroid) return { width, height };
    
    // Remove status bar and nav bar height from total height
    const adjustedHeight = height - ANDROID_STATUSBAR_HEIGHT - ANDROID_NAVBAR_HEIGHT;
    
    return {
      width,
      height: adjustedHeight,
      windowWidth: width,
      windowHeight: height
    };
  },
  
  // Check if device has a notch or cutout
  hasNotch: () => {
    if (!isAndroid) return false;
    
    // Simple heuristic based on aspect ratio and API level
    // Real implementation would use Android's DisplayCutout API
    const aspectRatio = height / width;
    return androidApiLevel >= 28 && aspectRatio >= 2;
  },
  
  // Get pixel density for high-resolution handling
  getPixelDensity: () => PixelRatio.get(),
};

// Android-specific theme adjustments
export const androidTheme = {
  // Material Design adjustments for Android
  getMaterialDesignColors: (primaryColor: string, secondaryColor: string) => {
    if (!isAndroid) return { primary: primaryColor, secondary: secondaryColor };
    
    // Android Material Design typically uses slightly different shades
    // These are simplified transformations for demonstration
    const darkenPrimary = primaryColor; // Would transform to material design appropriate shade
    const darkenSecondary = secondaryColor; // Would transform to material design appropriate shade
    
    return {
      primary: darkenPrimary,
      secondary: darkenSecondary,
      rippleColor: 'rgba(0, 0, 0, 0.12)',
      elevationColor: 'rgba(0, 0, 0, 0.4)'
    };
  },
  
  // Font family adjustments for Android
  getCompatibleFonts: (requestedFont: string) => {
    if (!isAndroid) return requestedFont;
    
    // Map iOS font names to Android equivalents
    const fontMap: { [key: string]: string } = {
      'Poppins': 'sans-serif', // Fallback if Poppins not available
      'Poppins-Bold': 'sans-serif-medium',
      'Poppins-Light': 'sans-serif-light',
      'Poppins-Medium': 'sans-serif',
      'Poppins-Regular': 'sans-serif',
      'Poppins-SemiBold': 'sans-serif-medium',
      'System': 'sans-serif',
    };
    
    return fontMap[requestedFont] || 'sans-serif';
  }
};

// Android-specific animation adjustments
export const androidAnimation = {
  // Get appropriate animation durations (Android often needs faster animations)
  getAnimationDuration: (iosDuration: number) => {
    if (!isAndroid) return iosDuration;
    return Math.floor(iosDuration * 0.8); // Android animations typically 20% faster
  },
  
  // Check if device supports advanced animations
  supportsAdvancedAnimations: () => {
    if (!isAndroid) return true;
    return androidApiLevel >= 26; // Oreo and above support better animations
  }
};

// Android-specific input handling
export const androidInput = {
  // Adjust keyboard behavior for Android
  getKeyboardAvoidingConfig: () => {
    if (!isAndroid) return {};
    
    return {
      behavior: undefined, // 'height' and 'position' are iOS only
      keyboardVerticalOffset: 0,
      // Android specific config would go here
    };
  },
  
  // Handle Android back button in a consistent way
  setupBackButtonHandler: (callback: () => boolean) => {
    // In a real implementation, this would use BackHandler from react-native
    // For now, just a placeholder
    if (isAndroid) {
      // Would set up event listener for hardware back button
      console.log('Android back handler would be set up here');
    }
    return () => {
      // Cleanup function
      if (isAndroid) {
        // Would remove event listener
        console.log('Android back handler would be cleaned up here');
      }
    };
  }
};

// Export combined utilities
export const androidCompat = {
  isAndroid,
  isAndroidTablet,
  apiLevel: androidApiLevel,
  layout: androidLayout,
  theme: androidTheme,
  animation: androidAnimation,
  input: androidInput
};