import { BrowserWindow } from 'electron';
const ElectronGoogleOAuth2 = require('electron-google-oauth2');
import { google } from 'googleapis';
import { authStore } from './store';
import { TAuthTokens, GoogleUser, GoogleCredentials } from '../shared/types';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// OAuth2 config
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = 'http://localhost:1212';
const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

// Create the OAuth client
const createOAuthClient = () => {
  // Ensure we're in a Node.js environment (main process)
  if (process.type !== 'browser') {
    throw new Error('OAuth client can only be created in the main process');
  }

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials are not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.');
  }

  return new ElectronGoogleOAuth2({
    clientId,
    clientSecret,
    scopes,
    redirectUri,
  });
};

// Get user profile from access token
export const getUserProfile = async (accessToken: string): Promise<GoogleUser> => {
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const peopleApi = google.people({ version: 'v1', auth: oauth2Client });
    const { data } = await peopleApi.people.get({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,photos'
    });

    // Extract and format user data
    const profile: GoogleUser = {
      id: data.resourceName?.replace('people/', '') || '',
      name: data.names?.[0]?.displayName || '',
      email: data.emailAddresses?.[0]?.value || '',
      picture: data.photos?.[0]?.url || '',
    };

    return profile;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    throw new Error('Failed to retrieve user profile from Google');
  }
};

// Login with Google - Only call this from the main process
export const loginWithGoogle = async (mainWindow: BrowserWindow): Promise<GoogleUser> => {
  try {
    // Ensure we're in the main process
    if (process.type !== 'browser') {
      throw new Error('Login can only be performed from the main process');
    }

    const oAuth2Client = createOAuthClient();

    // Set the window for the auth process
    oAuth2Client.setWindowOptions({
      alwaysOnTop: true,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      },
      parent: mainWindow
    });

    // Get credentials
    const credentials = await oAuth2Client.openAuthWindowAndGetTokens();

    // Extract and format tokens
    const tokens: TAuthTokens = {
      access_token: credentials.access_token,
      refresh_token: credentials.refresh_token,
      id_token: credentials.id_token,
      expiry_date: credentials.expiry_date
    };

    // Save tokens to secure storage
    authStore.set('auth_tokens', tokens);

    // Get user profile
    const userProfile = await getUserProfile(tokens.access_token);

    // Save user profile
    authStore.set('user_profile', userProfile);

    return userProfile;
  } catch (error) {
    console.error('Google login failed:', error);
    throw error;
  }
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  const tokens = authStore.get('auth_tokens') as TAuthTokens | undefined;
  return Boolean(tokens && tokens.access_token);
};

// Get current user
export const getCurrentUser = (): GoogleUser | null => {
  return authStore.get('user_profile') as GoogleUser | null;
};

// Logout
export const logout = (): boolean => {
  authStore.delete('auth_tokens');
  authStore.delete('user_profile');
  return true;
};

// Refresh token if needed
export const refreshTokenIfNeeded = async (): Promise<boolean> => {
  const tokens = authStore.get('auth_tokens') as TAuthTokens | undefined;

  if (!tokens || !tokens.refresh_token) {
    return false;
  }

  // Check if token is expired or about to expire
  const now = Date.now();
  const tokenExpiryTime = tokens.expiry_date || 0;

  // If token is still valid for more than 5 minutes, no need to refresh
  if (tokenExpiryTime > (now + 5 * 60 * 1000)) {
    return true;
  }

  try {
    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials are not configured');
    }

    // Create OAuth client for token refresh
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    // Set the refresh token
    oauth2Client.setCredentials({
      refresh_token: tokens.refresh_token
    });

    // Refresh the token
    const { credentials } = await oauth2Client.refreshAccessToken();

    const creds = credentials as unknown as GoogleCredentials;

    // Update tokens in storage
    const updatedTokens: TAuthTokens = {
      access_token: creds.access_token || '',
      refresh_token: creds.refresh_token || tokens.refresh_token,
      id_token: creds.id_token,
      expiry_date: creds.expiry_date
    };

    authStore.set('auth_tokens', updatedTokens);
    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};

// ========== React Auth Context ==========

// Define the Auth Context type
interface AuthContextType {
  user: GoogleUser | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

// Create the Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load user data on mount
  useEffect(() => {
    const checkAuth = async () => {
      const isUserLoggedIn = isLoggedIn();
      setIsAuthenticated(isUserLoggedIn);

      if (isUserLoggedIn) {
        const userProfile = getCurrentUser();
        setUser(userProfile);

        // Refresh token if needed
        await refreshTokenIfNeeded();
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async () => {
    try {
      // Since this is a renderer process, we need to use IPC to call the main process
      // This is just a placeholder - you'll need to implement the actual IPC call
      // For now, we'll simulate successful login
      const userProfile = getCurrentUser();
      setUser(userProfile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Logout function
  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Refresh auth function
  const refreshAuth = async () => {
    const success = await refreshTokenIfNeeded();
    if (!success) {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout: handleLogout,
    refreshAuth
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Default export for the hook to make imports cleaner
export default useAuth;
