import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { initializeFirebase, createUser, getDataFromFirestore, listAllUsers, getUserRole, getUserById, updateUser } from './src/config/firebase-admin.js';
import { listAllProducts, addProduct  } from './src/config/firebase.js';

/*
 * This is the main file for the electron app
 */

// Initialize Firebase Admin before opening the window
initializeFirebase();

// Fix for ES Modules not having __dirname
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,  // Disable nodeIntegration for security
      contextIsolation: true,  // Enable contextIsolation for security
      preload: path.join(__dirname, 'preload.js'),  // Absolute path for preload.js
    }
  });

  // Correct the path to index.html
  const indexPath = path.join(__dirname, 'dist-react', 'index.html');

  // Log the resolved path
  console.log('Loading index.html from:', indexPath);

  // Verify if the file exists
  if (fs.existsSync(indexPath)) {
    console.log('index.html exists at:', indexPath);
  } else {
    console.error('index.html does NOT exist at:', indexPath);
  }

  // Load the file into the Electron window
  win.loadFile(indexPath).catch(err => {
    console.error("Error loading index.html:", err);
  });
}

// IPC handlers...
ipcMain.handle('create-user', async (event, { name, email, password, role }) => {
  try {
    const userRecord = await createUser(name, email, password, role);
    return { success: true, userRecord }; // Return success and user record
  } catch (error) {
    throw new Error(error.message); // Throw error to be caught in the renderer process
  }
});

ipcMain.handle('list-all-users', async () => {
  return await listAllUsers();
});

ipcMain.handle('list-user-role', async (event , uid) => {
  return getUserRole(uid);
});


ipcMain.handle('list-all-products', async (event , uid) => {
  return listAllProducts();
});

ipcMain.handle('create-product', async (event, productData) => {
  return addProduct(productData);
});


ipcMain.handle('get-user', async (event, uid) => {
  console.log("fetch event");
  return getUserById(uid);
});


ipcMain.handle('update-user', async (event, { uid, name, email, password, role }) => {
  try {
    console.log("AD:",{uid, name, email, password, role});
    return updateUser(uid, name, email, password, role);
  } catch (error) {
    throw new Error(error.message); // Throw error to be caught in the renderer process
  }
});

// If an error occurs we can pass it to this handler to display to the user
ipcMain.on('show-error', (event, title, content) => {
  dialog.showErrorBox(title, content);
});

// Start the application
app.whenReady().then(createWindow);
