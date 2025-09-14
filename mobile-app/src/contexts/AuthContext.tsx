import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on component mount
    const bootstrapAsync = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        
        if (token) {
          // You would normally validate the token with your backend
          const userJSON = await AsyncStorage.getItem('user');
          if (userJSON) {
            setUser(JSON.parse(userJSON));
          }
        }
      } catch (e) {
        console.error('Failed to restore authentication state', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This would be a real API call in production
      // For demo purposes, we'll just simulate a successful login
      const mockResponse = {
        user: { id: '1', username: 'demouser', email },
        token: 'mock-auth-token',
      };

      // Store the user's token in secure storage
      await SecureStore.setItemAsync('userToken', mockResponse.token);
      // Store the user data in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(mockResponse.user));
      
      setUser(mockResponse.user);
    } catch (e) {
      console.error('Login failed', e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // This would be a real API call in production
      // For demo purposes, we'll just simulate a successful registration
      const mockResponse = {
        user: { id: '1', username, email },
        token: 'mock-auth-token',
      };

      // Store the user's token in secure storage
      await SecureStore.setItemAsync('userToken', mockResponse.token);
      // Store the user data in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(mockResponse.user));
      
      setUser(mockResponse.user);
    } catch (e) {
      console.error('Registration failed', e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      // Remove token from secure storage
      await SecureStore.deleteItemAsync('userToken');
      // Remove user data from AsyncStorage
      await AsyncStorage.removeItem('user');
      
      setUser(null);
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
