// src/main/index.ts
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { loginWithGoogle, logout, isLoggedIn, getCurrentUser } from './auth';

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load your app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:1212');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Check if user is already logged in and send that info to renderer
  getCurrentUser()
    .then(user => {
      if (user && mainWindow) {
        mainWindow.webContents.send('auth:restore-session', user);
      }
    })
    .catch(err => console.error('Error checking auth status:', err));
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers for auth
ipcMain.handle('auth:login', async () => {
  if (!mainWindow) return null;
  try {
    return await loginWithGoogle(mainWindow);
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
});

ipcMain.handle('auth:logout', async () => {
  logout();
  return true;
});

ipcMain.handle('auth:is-logged-in', async () => {
  return isLoggedIn();
});

ipcMain.handle('auth:get-current-user', async () => {
  return await getCurrentUser();
});
