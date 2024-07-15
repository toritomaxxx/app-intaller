const { ipcMain } =require ("electron");
const { execSync } =require ("child_process");
const ADB = "./src/ADB/Linux/adb";
const deviceList = [];
const selectedDeviceName = "";
const selectedDeviceID = "";

const browserDevice = () => {
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
            console.log(deviceID);
            let model = execSync(`${ADB}`+" "+"-s"+" "+`${deviceID}`+" "+"shell" +" "+"getprop ro.product.model")
              .toString()
              .split("\n")[0];
            model = model.split("\n")[0];
            deviceList.push({ id: deviceID, model: model });
          });
        } catch (error) {
            console.log(`error: ${error.message}`);
        }
        return deviceList;  
}

module.exports = {browserDevice};