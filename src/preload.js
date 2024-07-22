const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  device: () => ipcRenderer.invoke('browser-device')
})
ipcRenderer.on('save-config-reply', (event, message) => {
  console.log(message);
});
