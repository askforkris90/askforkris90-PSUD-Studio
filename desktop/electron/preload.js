const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('psud', {
  getVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  platform: process.platform,
});
