import { app, BrowserWindow, ipcMain, dialog, protocol } from 'electron';
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

    const distPath = path.join(__dirname, '../dist/index.html');
    const isDev = !fs.existsSync(distPath) || process.env.NODE_ENV === 'development';
    const devUrl = 'http://localhost:5173';

    if (isDev) {
        console.log('Cargando en modo desarrollo desde:', devUrl);
        mainWindow.loadURL(devUrl).catch(err => {
            console.error('Error al cargar la URL de desarrollo:', err);
        });
        mainWindow.webContents.openDevTools();
    } else {
        console.log('Cargando build desde:', distPath);
        mainWindow.loadFile(distPath);
    }

    // Log útil para debugging
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error('Falló la carga:', errorCode, errorDescription);
    });
}

app.whenReady().then(() => {
    protocol.registerFileProtocol('local-audio', (request, callback) => {
        const url = request.url.replace(/^local-audio:\/\//, '');
        try {
            const decodedPath = decodeURI(url);
            const normalizedPath = path.normalize(decodedPath);
            const ext = path.extname(normalizedPath).toLowerCase();
            
            // Mapeo de extensiones a MIME types
            const mimeTypes = {
                '.mp3': 'audio/mpeg',
                '.wav': 'audio/wav',
                '.ogg': 'audio/ogg',
                '.m4a': 'audio/mp4'
            };
            
            return callback({
                path: normalizedPath,
                headers: {
                    'Content-Type': mimeTypes[ext] || 'application/octet-stream'
                }
            });
        } catch (error) {
            console.error('Error cargando archivo:', error);
            return callback({ error: -6 });
        }
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC handlers
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
    
    try {
        const files = fs.readdirSync(folder)
            .filter(f => allowed.has(path.extname(f).toLowerCase()))
            .map(f => path.join(folder, f));
        return files;
    } catch (err) {
        console.error('Error leyendo carpeta:', err);
        return [];
    }
});