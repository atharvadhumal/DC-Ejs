import StoreModule from 'electron-store';
const Store = StoreModule as any;

// Store for saving auth tokens
export const authStore = new Store({
  name: 'auth-store',
  encryptionKey: 'xT5q9cR2z8Lp3F7kD1jH4sA6mE0vB2nX' // Use a strong random key
});
