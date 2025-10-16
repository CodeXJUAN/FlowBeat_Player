import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false
        }
    });

    const devUrl = 'http://localhost:5173';

    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL(devUrl);
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

await app.whenReady();
createWindow();

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// IPC handlers para abrir diálogo (más adelante los llamaremos desde React)
ipcMain.handle('dialog:openFiles', async () => {
    const res = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Audio', extensions: ['mp3', 'wav', 'ogg', 'm4a'] }]
    });
    return res.canceled ? [] : res.filePaths;
});

ipcMain.handle('dialog:openFolder', async () => {
    const res = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });
    if (res.canceled || !res.filePaths.length) return [];
    const folder = res.filePaths[0];
    const allowed = new Set(['.mp3', '.wav', '.ogg', '.m4a']);
    const files = fs.readdirSync(folder)
        .filter(f => allowed.has(path.extname(f).toLowerCase()))
        .map(f => path.join(folder, f));
    return files;
});