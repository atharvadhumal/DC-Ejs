import StoreModule from 'electron-store';
const Store = StoreModule as any;

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
