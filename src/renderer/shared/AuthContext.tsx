// src/renderer/shared/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Types for Google user
export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name?: string;
  family_name?: string;
}

// Add type definition for window.electronAPI
declare global {
  interface Window {
    electronAPI?: {
      auth?: {
        onAuthSuccess: (callback: (userData: GoogleUser) => void) => void;
        onAuthError: (callback: (errorMsg: string) => void) => void;
        onRestoreSession: (callback: (userData: GoogleUser) => void) => void;
        isLoggedIn: () => Promise<boolean>;
        getCurrentUser: () => Promise<GoogleUser>;
        login: () => Promise<void>;
        logout: () => Promise<void>;
      };
    };
  }
}

interface AuthContextType {
  user: GoogleUser | null;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if electronAPI is available
    if (!window.electronAPI || !window.electronAPI.auth) {
      console.error('Electron API or auth module is not available');
      setError('Authentication services are not available');
      setLoading(false);
      return;
    }

    // Set up auth event listeners
    window.electronAPI.auth.onAuthSuccess((userData: GoogleUser) => {
      setUser(userData);
      setLoading(false);
      setError(null);
    });

    window.electronAPI.auth.onAuthError((errorMsg: string) => {
      setError(errorMsg);
      setLoading(false);
    });

    window.electronAPI.auth.onRestoreSession((userData: GoogleUser) => {
      setUser(userData);
      setLoading(false);
    });

    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        // Ensure electronAPI is still available
        if (!window.electronAPI?.auth) {
          throw new Error('Electron API not available');
        }

        const isLoggedIn = await window.electronAPI.auth.isLoggedIn();
        if (isLoggedIn) {
          const currentUser = await window.electronAPI.auth.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setError('Failed to check authentication status');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!window.electronAPI?.auth) {
        throw new Error('Electron API not available');
      }
      await window.electronAPI.auth.login();
      // The result will be handled by the onAuthSuccess listener
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed: ' + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (!window.electronAPI?.auth) {
        throw new Error('Electron API not available');
      }
      await window.electronAPI.auth.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Logout failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
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
