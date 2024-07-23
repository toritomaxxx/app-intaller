const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  device: () => ipcRenderer.invoke('browser-device'),
  version: () => ipcRenderer.invoke('system'),
  config: (config) => ipcRenderer.invoke('save-config', config),
  getConfig: () => ipcRenderer.invoke('get-config'),
  sendOrder: (order) => ipcRenderer.invoke('send-order', order)
});

