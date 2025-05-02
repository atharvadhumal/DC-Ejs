import { ipcMain, BrowserWindow } from 'electron';
import {
  loginWithGoogle,
  getUserProfile,
  isLoggedIn,
  logout,
  getCurrentUser,
  refreshTokenIfNeeded
} from '../renderer/shared/AuthContext';

// IPC channel constants
const IPC_AUTH_LOGIN = 'auth:login';
const IPC_AUTH_LOGOUT = 'auth:logout';
const IPC_AUTH_STATUS = 'auth:status';
const IPC_AUTH_USER = 'auth:user';
const IPC_AUTH_REFRESH = 'auth:refresh';

/**
 * Register all authentication-related IPC handlers
 * @param mainWindow The main application window
 */
export const registerAuthHandlers = (mainWindow: BrowserWindow) => {
  // Handle login request
  ipcMain.handle(IPC_AUTH_LOGIN, async () => {
    try {
      // Ensure environment variables are set
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error('Google OAuth credentials are not configured');
      }

      const userProfile = await loginWithGoogle(mainWindow);
      return userProfile;
    } catch (error) {
      console.error('Auth handler login error:', error);
      throw error;
    }
  });

  // Handle logout request
  ipcMain.handle(IPC_AUTH_LOGOUT, async () => {
    try {
      return logout();
    } catch (error) {
      console.error('Auth handler logout error:', error);
      throw error;
    }
  });

  // Check if user is logged in
  ipcMain.handle(IPC_AUTH_STATUS, async () => {
    try {
      // Refresh token if needed
      await refreshTokenIfNeeded();
      return isLoggedIn();
    } catch (error) {
      console.error('Auth handler status check error:', error);
      return false;
    }
  });

  // Get current user
  ipcMain.handle(IPC_AUTH_USER, () => {
    try {
      return getCurrentUser();
    } catch (error) {
      console.error('Auth handler get user error:', error);
      throw error;
    }
  });

  // Manually refresh token
  ipcMain.handle(IPC_AUTH_REFRESH, async () => {
    try {
      return await refreshTokenIfNeeded();
    } catch (error) {
      console.error('Auth handler token refresh error:', error);
      return false;
    }
  });
};

/**
 * Unregister all authentication-related IPC handlers
 */
export const unregisterAuthHandlers = () => {
  ipcMain.removeHandler(IPC_AUTH_LOGIN);
  ipcMain.removeHandler(IPC_AUTH_LOGOUT);
  ipcMain.removeHandler(IPC_AUTH_STATUS);
  ipcMain.removeHandler(IPC_AUTH_USER);
  ipcMain.removeHandler(IPC_AUTH_REFRESH);
};
