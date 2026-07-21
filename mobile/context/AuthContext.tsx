import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { Platform } from 'react-native';
import client from '../api/client';

interface User {
  id: string;
  email: string;
  name: string;
  plan: string;
  tasksUsed: number;
  tasksLimit: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      let storedToken, storedUser;
      if (Platform.OS === 'web') {
        storedToken = localStorage.getItem('auth_token');
        storedUser = localStorage.getItem('user');
      } else {
        storedToken = await SecureStore.getItemAsync('auth_token');
        storedUser = await SecureStore.getItemAsync('user');
      }

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Refresh user data from API
        try {
          const response = await client.get('/auth/me');
          if (response.data.user) {
            const updatedUser = response.data.user;
            setUser(updatedUser);
            if (Platform.OS === 'web') {
              localStorage.setItem('user', JSON.stringify(updatedUser));
            } else {
              await SecureStore.setItemAsync('user', JSON.stringify(updatedUser));
            }
          }
        } catch (e) {
          console.error('Failed to refresh user', e);
          if (axios.isAxiosError(e) && e.response?.status === 401) {
            await logout();
          }
        }
      }
    } catch (e) {
      console.error('Failed to load storage data', e);
    } finally {
      setLoading(false);
    }
  }

  const login = async (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    if (Platform.OS === 'web') {
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      await SecureStore.setItemAsync('auth_token', newToken);
      await SecureStore.setItemAsync('user', JSON.stringify(newUser));
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    if (Platform.OS === 'web') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    } else {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('user');
    }
  };

  const updateUser = async () => {
    if (!token) return;
    try {
      const response = await client.get('/auth/me');
      if (response.data.user) {
        setUser(response.data.user);
        if (Platform.OS === 'web') {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
          await SecureStore.setItemAsync('user', JSON.stringify(response.data.user));
        }
      }
    } catch (e) {
      console.error('Failed to update user', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
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
