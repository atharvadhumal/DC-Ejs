
import { configureStore } from '@reduxjs/toolkit'
import mainSlice from './rdx-slice'
// ...

export const store = configureStore({
  reducer: {
    main: mainSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// Use dynamic import for ES Module compatibility
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Store = require('electron-store');

// Generate a secure encryption key or read from environment
const generateSecureKey = () => {
  // In production, use a properly generated key from environment variables
  return process.env.ENCRYPTION_KEY || 'temp_secure_key_replace_in_production';
};

// Store for saving auth tokens with encryption
export const authStore = new Store({
  name: 'auth-store',
  encryptionKey: generateSecureKey(),
});

// Helper methods to safely interact with the store
export const storeHelpers = {
  // Get value with optional default
  get: <T>(key: string, defaultValue?: T): T => {
    return authStore.get(key, defaultValue) as T;
  },

  // Set value
  set: <T>(key: string, value: T): void => {
    authStore.set(key, value);
  },

  // Delete key
  delete: (key: string): void => {
    authStore.delete(key);
  },

  // Clear all
  clear: (): void => {
    authStore.clear();
  }
};

// Extended store helpers with additional functionality
export const extendedStoreHelpers = {
  ...storeHelpers,

  // Check if key exists
  has: (key: string): boolean => {
    return authStore.has(key);
  },

  // Get all keys as array
  getKeys: (): string[] => {
    return Object.keys(authStore.store);
  },

  // Get the store as a JavaScript object
  getStore: (): Record<string, unknown> => {
    return authStore.store as Record<string, unknown>;
  },

  // Set multiple key-value pairs at once
  setMultiple: (data: Record<string, unknown>): void => {
    Object.entries(data).forEach(([key, value]) => {
      authStore.set(key, value);
    });
  },

  // Delete multiple keys at once
  deleteMultiple: (keys: string[]): void => {
    keys.forEach(key => {
      authStore.delete(key);
    });
  }
};
