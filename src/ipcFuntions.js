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
  return false
};

const saveConfigJson = (config) => {
  fs.writeFileSync("./src/config/config.json", JSON.stringify(config)).then(() => {
    console.log("config saved");
  });
}

const getConfigJson = () => {
  return JSON.parse(fs.readFileSync("./src/config/config.json"));

}


module.exports = {
  browserDevice,
  system,
  saveConfigJson,
  getConfigJson
};
