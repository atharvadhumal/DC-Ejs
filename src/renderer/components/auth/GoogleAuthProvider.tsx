import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { ipcRenderer } from 'electron';
import { GoogleUser } from '../../shared/types';

// IPC channel constants
const IPC_AUTH_LOGIN = 'auth:login';
const IPC_AUTH_LOGOUT = 'auth:logout';
const IPC_AUTH_STATUS = 'auth:status';
const IPC_AUTH_USER = 'auth:user';

interface AuthContextType {
  user: GoogleUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const GoogleAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const status = await ipcRenderer.invoke(IPC_AUTH_STATUS);
      setIsAuthenticated(status);

      if (status) {
        const userData = await ipcRenderer.invoke(IPC_AUTH_USER);
        setUser(userData);
      }
    } catch (err) {
      setError('Failed to check authentication status');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = await ipcRenderer.invoke(IPC_AUTH_LOGIN);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await ipcRenderer.invoke(IPC_AUTH_LOGOUT);
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError('Logout failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async () => {
    if (!isAuthenticated) return;

    try {
      const status = await ipcRenderer.invoke(IPC_AUTH_STATUS);
      if (!status) {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Failed to refresh authentication status', err);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useGoogleAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useGoogleAuth must be used within a GoogleAuthProvider');
  }
  return context;
};
