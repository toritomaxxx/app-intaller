const { ipcMain } = require("electron");
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

module.exports = { browserDevice };
