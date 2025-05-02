// src/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

// Type for Google user
interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name?: string;
  family_name?: string;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Authentication methods
  auth: {
    login: async (): Promise<GoogleUser | null> => {
      return await ipcRenderer.invoke('auth:login');
    },
    logout: async (): Promise<boolean> => {
      return await ipcRenderer.invoke('auth:logout');
    },
    isLoggedIn: async (): Promise<boolean> => {
      return await ipcRenderer.invoke('auth:is-logged-in');
    },
    getCurrentUser: async (): Promise<GoogleUser | null> => {
      return await ipcRenderer.invoke('auth:get-current-user');
    },
    onAuthSuccess: (callback: (user: GoogleUser) => void) => {
      // Remove any existing listeners to prevent duplicates
      ipcRenderer.removeAllListeners('auth:success');
      ipcRenderer.on('auth:success', (_event, user) => callback(user));
    },
    onAuthError: (callback: (error: string) => void) => {
      // Remove any existing listeners to prevent duplicates
      ipcRenderer.removeAllListeners('auth:error');
      ipcRenderer.on('auth:error', (_event, error) => callback(error));
    },
    onRestoreSession: (callback: (user: GoogleUser) => void) => {
      // Remove any existing listeners to prevent duplicates
      ipcRenderer.removeAllListeners('auth:restore-session');
      ipcRenderer.on('auth:restore-session', (_event, user) => callback(user));
    }
  },
  // You can add more exposed APIs here if needed
  ipcRenderer: {
    sendMessage(channel: string, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: string, func: (...args: unknown[]) => void) {
      const subscription = (_event: Electron.IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: string, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});

// Log that preload script has executed
console.log('Preload script loaded successfully');
