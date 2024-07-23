const { app, BrowserWindow ,ipcMain} = require("electron");
const path = require("node:path");
const {browserDevice,system,saveConfigJson,getConfigJson,sendOrder} = require("./ipcFuntions");



if(process.env.NODE_ENV !== "production"){
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "../node_modules", ".bin", "electron"),
    hardResetMethod: "exit",
  });
}



const createWindow = () => {

  const mainWindow = new BrowserWindow({
    width: 600,
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


  mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {

  ipcMain.handle("browser-device", () => {
   return browserDevice()
  });

  ipcMain.handle("system", () => {
    return system()
   });

   ipcMain.handle("save-config", (event , config) => {
    console.log(config);
    return saveConfigJson(config)
   });
   ipcMain.handle("get-config", () => {
    console.log ();
    return getConfigJson()
    });
    ipcMain.handle("send-order", (event , order) => {
      return sendOrder(order)
     }
    );


  createWindow();
  
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
