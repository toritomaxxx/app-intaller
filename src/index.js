const { app, shell, BrowserWindow ,ipcMain} = require("electron");
const path = require("node:path");
const {browserDevice} = require("./ipcFuntions");

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 300,
    height: 380,
    autoHideMenuBar: true,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true,
      devTools: true,
    },
    resizable: false,
  });


  const configWindow = new BrowserWindows({
    width: 300,
    height: 380,
    title: "Configuracion",
  });
  configWindow.setMenu(null);

  configWindow.loadURL(url.format({
    pathname: path.join(__dirname, "config.html"),
    protocol: "file",
    slashes: true,
  }))
  configWindow.on("close", () => {
    configWindow = null;
  });


  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};
app.whenReady().then(() => {
  

  ipcMain.handle("browser-device", () => {
   return browserDevice()
  });
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
