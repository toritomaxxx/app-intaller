const { app, shell, BrowserWindow ,ipcMain} = require("electron");
const { execSync} = require("child_process");
const os = require("os");
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
      let model = execSync(`${ADB}`+" " +"-s" +" " +`${deviceID}` +" " +"shell" +" " +"getprop ro.product.model").toString().split("\n")[0];
      model = model.split("\n")[0];
      model = model.split("\r")[0];
      deviceList.push({ id: deviceID, model: model });
    });
  } catch (error) {
    console.log(`error: ${error.message}`);
  }
  return deviceList;
};

const configWindows = () => {
  console.log("config window");
  const configWindow = new BrowserWindow({
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
  configWindow.show();
}

const openConfigWindows = () => {
  ipcMain.handle("config-windows", () => {
    return configWindows();
  });

}

module.exports = { 
  browserDevice,
  openConfigWindows

 };
