// src/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

// Type for Google user
export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name?: string;
  family_name?: string;
}

export interface ElectronHandler {
  auth: {
    login(): Promise<GoogleUser | null>;
    logout(): Promise<boolean>;
    isLoggedIn(): Promise<boolean>;
    getCurrentUser(): Promise<GoogleUser | null>;
    onAuthSuccess(callback: (user: GoogleUser) => void): void;
    onAuthError(callback: (error: string) => void): void;
    onRestoreSession(callback: (user: GoogleUser) => void): void;
  };
  ipcRenderer: {
    sendMessage(channel: string, args: unknown[]): void;
    on(channel: string, func: (...args: unknown[]) => void): (() => void) | undefined;
    once(channel: string, func: (...args: unknown[]) => void): void;
  };
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronHandler: ElectronHandler = {
  auth: {
    login: async () => {
      return await ipcRenderer.invoke('auth:login');
    },
    logout: async () => {
      return await ipcRenderer.invoke('auth:logout');
    },
    isLoggedIn: async () => {
      return await ipcRenderer.invoke('auth:is-logged-in');
    },
    getCurrentUser: async () => {
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
};

contextBridge.exposeInMainWorld('electronAPI', electronHandler);

// Log that preload script has executed
console.log('Preload script loaded successfully');
