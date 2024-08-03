let device = [];
var config = {};
let deviceList = [];

const func = async () => {
  const response = await window.versions.device();
  deviceList = response;
  return response;
};

const updateDevices = async () => {
  const devices = await func();
  updateSelectDevice();
  toggleDevices(devices);
};

function toggleDevices(devices) {
  if (devices.length === 0) {
    document.getElementById("trueDevice").style.display = "none";
    document.getElementById("falseDevice").style.display = "block";
  } else {
    document.getElementById("trueDevice").style.display = "block";
    document.getElementById("falseDevice").style.display = "none";

    if (devices.length === 1) {
      document.getElementById("anyDevice").style.display = "block";
      document.getElementById("moreDevice").style.display = "none";
      device = devices[0];
      document.getElementById("deviceName").innerHTML = device.model;
      document.getElementById("deviceID").innerHTML = device.id;
    } else if (devices.length !== 1) {
      document.getElementById("anyDevice").style.display = "none";
      document.getElementById("moreDevice").style.display = "block";
    }
  }
}

async function updateConfig(key, inputElement) {
  if (inputElement.files.length > 0) {
    const fullPath = inputElement.files[0].path;
    if (await window.versions.version()) {
      var folderPath = fullPath.substring(0, fullPath.lastIndexOf("\\"));
    } else {
      var folderPath = fullPath.substring(0, fullPath.lastIndexOf("/"));
    }
    config[key] = folderPath;
    inputElement.nextElementSibling.innerHTML = folderPath;
  }
}

async function saveConfig() {
   await window.versions.config(config);
  
}

async function getConfig() {
  config = await window.versions.getConfig();
  if (config.apk !== undefined) {
    document.getElementById("file-apk").nextElementSibling.innerHTML = config.apk;
  }
  if (config.docs !== undefined) {
    document.getElementById("file-docs").nextElementSibling.innerHTML = config.docs;
  }
  if (config.backgrounds !== undefined) {
    document.getElementById("file-backgrounds").nextElementSibling.innerHTML = config.backgrounds;
  }
}

async function sendOrder(id) {
  try {
    await window.versions.sendOrder(id, device);
  } catch (error) {
    console.error("Error al enviar la orden:", error);
  }
}

async function actualizarMensaje() {
  await window.versions.onUpdate((message) => {
    document.getElementById("message").style.display = "block";
    document.getElementById("message").innerHTML = message;
  });
}

function updateSelectDevice(){
  document.getElementById("deviceList").innerHTML = "";
  deviceList.forEach((device) => {
    let option = document.createElement("option");
    option.innerHTML = device.model;
    option.setAttribute("value", device.id);
    document.getElementById("deviceList").appendChild(option);
  });
}

async function selectDevice(device) {
  await window.versions.changeDevice(device);
}

updateDevices().then(()=>{
  if(deviceList.length == 0) return 
  selectDevice(deviceList[0].id);
})

setInterval(updateDevices, 5000);
getConfig();
actualizarMensaje();
