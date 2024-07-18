const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  device: () => ipcRenderer.invoke('browser-device')
})
contextBridge.exposeInMainWorld('config', {
  config: () => ipcRenderer.invoke('config-windows')
})