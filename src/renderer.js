let device = [];
var config = {};

const func = async () => {
  const response = await window.versions.device();
  return response;
};

const updateDevices = async () => {
  const devices = await func();
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
      let deviceList = document.getElementById("deviceList");
      deviceList.innerHTML = "";
      devices.forEach((device) => {
        let li = document.createElement("li");
        li.innerHTML = device.model;
        li.setAttribute("id", device.id);
        li.onclick = function () {
          device = device;
          document.getElementById("deviceName").innerHTML = device.model;
          document.getElementById("deviceID").innerHTML = device.id;
        };
        deviceList.appendChild(li);
      });
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
  window.location.href = 'index.html';

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
  let message = await window.versions.sendOrder(id, device);
  
}

updateDevices();
getConfig();
