/**
 * Performance optimization utilities for MindSpace app
 * Implements lazy loading, caching, and battery optimization techniques
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const AI_RESPONSE_CACHE_PREFIX = 'ai_response_';
const IMAGE_CACHE_PREFIX = 'img_cache_';

// Cache AI responses to improve response time
export const aiResponseCache = {
  // Save AI response to cache
  saveResponse: async (persona: string, query: string, response: string) => {
    try {
      // Create a hash of the query to use as key
      const key = `${AI_RESPONSE_CACHE_PREFIX}${persona}_${hashString(query)}`;
      const cacheData = {
        response,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheData));
      return true;
    } catch (error) {
      console.error('Error caching AI response:', error);
      return false;
    }
  },
  
  // Get cached AI response if available and not expired
  getResponse: async (persona: string, query: string) => {
    try {
      const key = `${AI_RESPONSE_CACHE_PREFIX}${persona}_${hashString(query)}`;
      const cachedData = await AsyncStorage.getItem(key);
      
      if (!cachedData) return null;
      
      const { response, timestamp } = JSON.parse(cachedData);
      
      // Check if cache is expired
      if (Date.now() - timestamp > CACHE_EXPIRY) {
        // Cache expired, remove it
        await AsyncStorage.removeItem(key);
        return null;
      }
      
      return response;
    } catch (error) {
      console.error('Error retrieving cached AI response:', error);
      return null;
    }
  },
  
  // Clear all AI response caches
  clearCache: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const aiCacheKeys = keys.filter(key => key.startsWith(AI_RESPONSE_CACHE_PREFIX));
      await AsyncStorage.multiRemove(aiCacheKeys);
      return true;
    } catch (error) {
      console.error('Error clearing AI cache:', error);
      return false;
    }
  }
};

// Image caching and lazy loading utilities
export const imageOptimization = {
  // Get cached image if available
  getCachedImage: async (url: string) => {
    try {
      const key = `${IMAGE_CACHE_PREFIX}${hashString(url)}`;
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error retrieving cached image:', error);
      return null;
    }
  },
  
  // Cache image data
  cacheImage: async (url: string, base64Data: string) => {
    try {
      const key = `${IMAGE_CACHE_PREFIX}${hashString(url)}`;
      await AsyncStorage.setItem(key, base64Data);
      return true;
    } catch (error) {
      console.error('Error caching image:', error);
      return false;
    }
  },
  
  // Calculate appropriate image quality based on network and device
  getOptimalImageQuality: async () => {
    // Implementation would check network quality and device capabilities
    // For now, we'll return default values
    return {
      quality: 0.8,
      resize: {
        width: 800,
        height: 600
      }
    };
  }
};

// Battery optimization utilities
export const batteryOptimization = {
  // Check if device is in low power mode (iOS) or battery saver (Android)
  isLowPowerModeEnabled: async () => {
    // This would be implemented with a native module
    // For now, return false as placeholder
    return false;
  },
  
  // Adjust app behavior based on battery status
  getOptimizationLevel: async () => {
    const isLowPower = await batteryOptimization.isLowPowerModeEnabled();
    
    return {
      // Disable animations when in low power mode
      animationsEnabled: !isLowPower,
      
      // Reduce background sync frequency
      backgroundSyncInterval: isLowPower ? 60 * 60 * 1000 : 15 * 60 * 1000,
      
      // Adjust location accuracy
      locationAccuracy: isLowPower ? 'low' : 'high',
      
      // Reduce polling frequency
      pollingInterval: isLowPower ? 30000 : 5000,
    };
  }
};

// Offline storage utilities
export const offlineStorage = {
  // Save critical user data for offline access
  saveUserDataOffline: async (userData: any) => {
    try {
      await AsyncStorage.setItem('offline_user_data', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error saving offline user data:', error);
      return false;
    }
  },
  
  // Get offline user data
  getUserDataOffline: async () => {
    try {
      const userData = await AsyncStorage.getItem('offline_user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error retrieving offline user data:', error);
      return null;
    }
  },
  
  // Store emergency resources for offline access
  saveEmergencyResourcesOffline: async (resources: any) => {
    try {
      await AsyncStorage.setItem('offline_emergency_resources', JSON.stringify(resources));
      return true;
    } catch (error) {
      console.error('Error saving offline emergency resources:', error);
      return false;
    }
  },
  
  // Get emergency resources for offline access
  getEmergencyResourcesOffline: async () => {
    try {
      const resources = await AsyncStorage.getItem('offline_emergency_resources');
      return resources ? JSON.parse(resources) : null;
    } catch (error) {
      console.error('Error retrieving offline emergency resources:', error);
      return null;
    }
  }
};

// Helper function to create a simple hash of a string
function hashString(str: string): string {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(16);
}