const { execSync } = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");
const adbWindows = "./src/ADB/Windows/adb.exe";
const adbLinux = "./src/ADB/Linux/adb";
let deviceList = [];
let ADB = "";
let pathJsonConfig = "";
let pathJsonConfigComplete = "";
let movil = "";

function configFunction() {
  const homeDir = process.env.HOME;
  if (os.platform() === "win32") {
    pathJsonConfig = path.join(
      homeDir,
      "AppData",
      "Roaming",
      "app-installer",
      "config"
    );
  } else {
    pathJsonConfig = path.join(homeDir, ".config", "app-installer");
  }
  fs.mkdirSync(pathJsonConfig, { recursive: true });
  
  pathJsonConfigComplete = path.join(pathJsonConfig, "config.json");
  if (!fs.existsSync(pathJsonConfigComplete)) {
    fs.writeFileSync(pathJsonConfigComplete, JSON.stringify({}));
  }
}

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
  } else {
    return false;
  }
};
function sendMessage(message, mainWindow) {
  mainWindow.webContents.send("message", message);
}

function saveConfigJson(config, mainWindow) {
  try {
    fs.writeFileSync(pathJsonConfigComplete, JSON.stringify(config));
    sendMessage("Se guardo la configuracion", mainWindow);
  } catch (error) {
    sendMessage("Error al guardar la configuracion", mainWindow);
  }
}

const getConfigJson = () => {
  return JSON.parse(fs.readFileSync(pathJsonConfigComplete));
};

function installApps(pathConfig, path, mainWindow) {
  for (let i = 0; i < path.length; i++) {
    try {
      execSync(`${ADB} -s ${movil} install ${pathConfig}/${path[i]}`)
      sendMessage(`Se instalo la aplicacion ${path[i]}`, mainWindow);
    } catch (error) {
      sendMessage(`Error al instalar la aplicacion ${path[i]}`, mainWindow);
    }
  }
  sendMessage("Se instalaron todas las aplicaciones", mainWindow);
}

function sendDocs(pathConfig, path, mainWindow) {
  const Dir = "/storage/emulated/0/documents/manuales";
  try {
    execSync(`${ADB} -s ${movil} shell mkdir -p ${Dir}`);
    sendMessage("Se creo el directorio", mainWindow);
  } catch (error) {
    sendMessage("Error al crear el directorio", mainWindow);
  }
  for (let i = 0; i < path.length; i++) {
    try {
      execSync(`${ADB} -s ${movil}  push "${pathConfig}/${path[i]}" ${Dir}`);
      sendMessage(`Se envio el archivo ${path[i]}`, mainWindow);
    } catch (error) {
      sendMessage(`Error al enviar el archivo ${path[i]}`, mainWindow);
    }
  }
  sendMessage("Se enviaron todos los documentos", mainWindow);
}
function sendBackgrounds(pathConfig, path, mainWindow) {
  const Dir = "/storage/emulated/0/pictures/backgrounds";
  try {
    execSync(`${ADB} -s ${movil} shell mkdir -p ${Dir}`);
     sendMessage("Se creo el directorio", mainWindow);
   } catch (error) {
     sendMessage("Error al crear el directorio", mainWindow);
   }
  for (let i = 0; i < path.length; i++) {
    try {
      execSync(`${ADB}  -s ${movil} push "${pathConfig}/${path[i]}" ${Dir}`);
      sendMessage(`Se envio el archivo ${path[i]}`, mainWindow);
    } catch (error) {
      sendMessage(`Error al enviar el archivo ${path[i]}`, mainWindow);
      console.log(error);
    }
    sendMessage("Se enviaron todas las imagenes", mainWindow);
  }
}

const sendOrder = (order, mainWindow) => {
  const apk = JSON.parse(fs.readFileSync(pathJsonConfigComplete)).apk;
  const docs = JSON.parse(fs.readFileSync(pathJsonConfigComplete)).docs;
  const backgrounds = JSON.parse(fs.readFileSync(pathJsonConfigComplete)).backgrounds;
  const apkFiles = fs.readdirSync(apk);
  const docsFiles = fs.readdirSync(docs);
  const backgroundsFiles = fs.readdirSync(backgrounds);
  if (order === "apk") {
    return installApps(apk, apkFiles, mainWindow);
  } else if (order === "docs") {
    sendDocs(docs, docsFiles, mainWindow);
  } else if (order === "backgrounds") {
    sendBackgrounds(backgrounds, backgroundsFiles, mainWindow);
  } else if (order === "all") {
    installApps(apk, apkFiles, mainWindow);
    sendDocs(docs, docsFiles, mainWindow);
    sendBackgrounds(backgrounds, backgroundsFiles, mainWindow);
    sendMessage("Proceso finalizado", mainWindow);
  }
};

const changeDevice = (device) => {
  movil = device;
};

configFunction();

module.exports = {
  browserDevice,
  system,
  saveConfigJson,
  getConfigJson,
  sendOrder,
  configFunction,
  changeDevice,
};
