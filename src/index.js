const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const {
  browserDevice,
  system,
  saveConfigJson,
  getConfigJson,
  sendOrder,
  configFunction,
  changeDevice,
} = require("./ipcFuntions");

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
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

  mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.webContents.openDevTools();
  
};

app.whenReady().then(() => {
  ipcMain.handle("browser-device", () => {
    return browserDevice();
  });

  ipcMain.handle("system", () => {
    return system();
  });

  ipcMain.handle("configFunction", () => {
    return configFunction();
  });

  ipcMain.handle("save-config", (event, config) => {
    return saveConfigJson(config, mainWindow);
  });

  ipcMain.handle("get-config", () => {
    return getConfigJson();
  });

  ipcMain.handle("send-order", (event, order) => {
    return sendOrder(order, mainWindow);
  });

  ipcMain.handle("change-device", (event, device) => {
    return changeDevice(device);
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
