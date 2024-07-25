const { app, shell, BrowserWindow, ipcMain } = require("electron");
const { execSync } = require("child_process");
const os = require("os");
const fs = require("fs");
const adbWindows = "./src/ADB/Windows/adb.exe";
const adbLinux = "./src/ADB/Linux/adb";
let deviceList = [];
let ADB = "";

const browserDevice = () => {
  deviceList = [];
  if (os.platform() === "win32") {
    ADB = `"${adbWindows}"`;
  } else {
    ADB = adbLinux;
  }

  try {
    const result = execSync(`${ADB}` + " " + "devices").toString();
    const devices = result.split("\n");
    devices.shift();
    devices.pop();
    devices.forEach((device) => {
      if (device.trim() === "") {
        return;
      }
      const deviceID = device.split("\t")[0];
      let model = execSync(
        `${ADB}` +
          " " +
          "-s" +
          " " +
          `${deviceID}` +
          " " +
          "shell" +
          " " +
          "getprop ro.product.model"
      )
        .toString()
        .split("\n")[0];
      model = model.split("\n")[0];
      model = model.split("\r")[0];
      deviceList.push({ id: deviceID, model: model });
    });
  } catch (error) {
    console.log(`error: ${error.message}`);
  }
  return deviceList;
};

const system = () => {
  if (os.platform() === "win32") {
    return true;
  }
  return false;
};
function sendMessage(message,mainWindow) {
  mainWindow.webContents.send("message", message);
}


function saveConfigJson(config,mainWindow) {
  try {
    fs.writeFileSync("./src/config/config.json", JSON.stringify(config));
    sendMessage("Se guardo la configuracion",mainWindow);
  } catch (error) {
    sendMessage("Error al guardar la configuracion",mainWindow);
  }
}


const getConfigJson = () => {
  return JSON.parse(fs.readFileSync("./src/config/config.json"));
};


function installApps(pathConfig, path,mainWindow) {
  for (let i = 0; i < path.length; i++) {
    try {
      execSync(`${ADB}` + " " + "install" + " " + `"${pathConfig}/${path[i]}"`);
      sendMessage(`Se instalo la aplicacion ${path[i]}`,mainWindow);
    } catch (error) {
      sendMessage(`Error al instalar la aplicacion ${path[i]}`,mainWindow);
    }
  }
}

function sendDocs(pathConfig, path,mainWindow) {
  const Dir = "/storage/emulated/0/documents";
  try {
    execSync(`${ADB} shell mkdir -p ${Dir}`);
    sendMessage("Se creo el directorio",mainWindow);
  } catch (error) {
    sendMessage("Error al crear el directorio",mainWindow);
  }
  for (let i = 0; i < path.length; i++) {
    try {
      execSync(`${ADB} push "${pathConfig}/${path[i]}" ${Dir}`);
      sendMessage(`Se envio el archivo ${path[i]}`,mainWindow);
    } catch (error) {
      sendMessage(`Error al enviar el archivo ${path[i]}`,mainWindow);
    }
  }
}
function sendBackgrounds(pathConfig, path,mainWindow) {
  const Dir = "/storage/emulated/0/Pictures";
  try {
    execSync(`${ADB} shell mkdir -p ${Dir}`);
    sendMessage("Se creo el directorio",mainWindow);
  } catch (error) {
    sendMessage("Error al crear el directorio",mainWindow);
  }
  for (let i = 0; i < path.length; i++) {
    try {
      execSync(`${ADB} push "${pathConfig}/${path[i]}" ${Dir}`);
      sendMessage(`Se envio el archivo ${path[i]}`,mainWindow);
    } catch (error) {
      sendMessage(`Error al enviar el archivo ${path[i]}`,mainWindow);
    }
  }
}

const sendOrder = (order,mainWindow) => {
  const apk = JSON.parse(fs.readFileSync("./src/config/config.json")).apk;
  const docs = JSON.parse(fs.readFileSync("./src/config/config.json")).docs;
  const backgrounds = JSON.parse(
    fs.readFileSync("./src/config/config.json")
  ).backgrounds;
  const apkFiles = fs.readdirSync(apk);
  const docsFiles = fs.readdirSync(docs);
  const backgroundsFiles = fs.readdirSync(backgrounds);

  if (order === "apk") {
    return installApps(apk, apkFiles,mainWindow);
  } else if (order === "docs") {
    sendDocs(docs, docsFiles,mainWindow);
  } else if (order === "backgrounds") {
    sendBackgrounds(backgrounds, backgroundsFiles,mainWindow);
  } else if (order === "all") {
    installApps(apk, apkFiles);
    sendDocs(docs, docsFiles);
    sendBackgrounds(backgrounds, backgroundsFiles,mainWindow);
  }
};

module.exports = {
  browserDevice,
  system,
  saveConfigJson,
  getConfigJson,
  sendOrder,
};
