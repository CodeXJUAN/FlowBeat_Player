import { contextBridge, ipcRenderer } from 'electron';

console.log('Preload script cargado');

contextBridge.exposeInMainWorld('electronAPI', {
    openFiles: () => {
        console.log('Llamando a openFiles');
        return ipcRenderer.invoke('dialog:openFiles');
    },
    openFolder: () => {
        console.log('Llamando a openFolder');
        return ipcRenderer.invoke('dialog:openFolder');
    }
});

console.log('electronAPI expuesto correctamente');