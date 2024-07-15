const { app, shell, BrowserWindow ,ipcMain} = require("electron");
const path = require("node:path");
const {browserDevice} = require("./ipcFuntions");

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 250,
    height: 300,
    // autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true,
      devTools: true,
    },
    // resizable: false,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};
app.whenReady().then(() => {
  

  ipcMain.handle("browser-device", () => {
    console.log(browserDevice());
  });
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
