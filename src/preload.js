const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  device: () => ipcRenderer.invoke('browser-device')
  
})