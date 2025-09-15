/**
 * Tablet Support Utilities for MindSpace app
 * Provides responsive layouts and conditional rendering for larger screens
 */

import { Dimensions, Platform } from 'react-native';
import { deviceUtils } from '../theme';

const { width, height } = Dimensions.get('window');

// Determine if the device is a tablet
export const isTablet = () => {
  // iPad detection for iOS
  if (Platform.OS === 'ios' && Platform.isPad) {
    return true;
  }
  
  // For Android and other platforms, use screen size
  // Devices with smallest dimension >= 600dp are considered tablets
  const smallestDimension = Math.min(width, height);
  return smallestDimension >= 600;
};

// Layout constants for different device sizes
export const layoutConstants = {
  // Spacing scales based on device size
  spacing: {
    xs: isTablet() ? 6 : 4,
    sm: isTablet() ? 10 : 8,
    md: isTablet() ? 16 : 12,
    lg: isTablet() ? 24 : 16,
    xl: isTablet() ? 32 : 20,
    xxl: isTablet() ? 48 : 32,
  },
  
  // Container padding
  containerPadding: isTablet() ? 24 : 16,
  
  // Max content width for tablets to prevent excessive stretching
  maxContentWidth: 800,
  
  // Column layouts
  columns: {
    phone: 1,
    smallTablet: 2,
    largeTablet: 3,
  },
  
  // Split screen threshold (minimum width to show split view)
  splitScreenThreshold: 768,
};

// Layout types for responsive rendering
export type LayoutType = 'compact' | 'regular' | 'wide';

// Get the current layout type based on screen width
export const getLayoutType = (): LayoutType => {
  if (width < 600) return 'compact'; // Phone
  if (width < 900) return 'regular'; // Small tablet
  return 'wide'; // Large tablet
};

// Master-Detail pattern helper
export const masterDetailConfig = {
  // Should show master and detail side by side?
  shouldShowSideBySide: () => width >= layoutConstants.splitScreenThreshold,
  
  // Master pane width calculation
  getMasterWidth: () => {
    if (width < layoutConstants.splitScreenThreshold) {
      return width; // Full width on smaller screens
    }
    // On larger screens, master takes 1/3 of the width (or 320px, whichever is larger)
    return Math.max(320, width / 3);
  },
  
  // Detail pane width calculation
  getDetailWidth: () => {
    if (width < layoutConstants.splitScreenThreshold) {
      return width; // Full width on smaller screens
    }
    // On larger screens, detail takes remaining space
    const masterWidth = Math.max(320, width / 3);
    return width - masterWidth;
  }
};

// Grid system for responsive layouts
export const gridSystem = {
  // Get number of columns based on screen width
  getColumnCount: () => {
    if (width < 600) return layoutConstants.columns.phone;
    if (width < 900) return layoutConstants.columns.smallTablet;
    return layoutConstants.columns.largeTablet;
  },
  
  // Calculate item width based on number of columns with spacing
  getItemWidth: (spacing: number = 16) => {
    const columnCount = gridSystem.getColumnCount();
    const totalSpacing = spacing * (columnCount - 1);
    return (width - totalSpacing - (layoutConstants.containerPadding * 2)) / columnCount;
  }
};

// Font sizing for different device types
export const fontSizing = {
  // Get adjusted font size based on device type
  getAdjustedFontSize: (baseSize: number) => {
    if (isTablet()) {
      return baseSize * 1.15; // 15% larger on tablets
    }
    return baseSize;
  },
  
  // Common font sizes
  sizes: {
    xs: isTablet() ? 12 : 10,
    sm: isTablet() ? 14 : 12,
    md: isTablet() ? 16 : 14,
    lg: isTablet() ? 20 : 16,
    xl: isTablet() ? 24 : 20,
    xxl: isTablet() ? 32 : 24,
    xxxl: isTablet() ? 40 : 32,
  }
};

// Responsive component generator
export const createResponsiveComponent = (
  compactComponent: React.ComponentType,
  regularComponent: React.ComponentType,
  wideComponent?: React.ComponentType
) => {
  return (props: any) => {
    const layoutType = getLayoutType();
    
    if (layoutType === 'wide' && wideComponent) {
      const WideComponent = wideComponent;
      return <WideComponent {...props} />;
    }
    
    if (layoutType === 'regular') {
      const RegularComponent = regularComponent;
      return <RegularComponent {...props} />;
    }
    
    const CompactComponent = compactComponent;
    return <CompactComponent {...props} />;
  };
};

// Combined tablet utilities export
export const tabletUtils = {
  isTablet: isTablet(),
  layoutType: getLayoutType(),
  layoutConstants,
  masterDetail: masterDetailConfig,
  grid: gridSystem,
  fonts: fontSizing,
  createResponsiveComponent,
};