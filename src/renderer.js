let device = []
const func = async () => {
    const response = await window.versions.device()
    console.log(response)

    return response 
  }
  

  const updateDevices = async () => {
    const devices = await func()
    toggleDevices(devices)
  }

function toggleDevices(devices){

  if(
    devices.length === 0
  ) {
    document.getElementById("trueDevice").style.display = "none";
    document.getElementById("falseDevice").style.display = "block";
  }
  else {
    document.getElementById("trueDevice").style.display = "block";
    document.getElementById("falseDevice").style.display = "none";

    if (devices.length === 1) {
      document.getElementById("anyDevice").style.display = "block";
      document.getElementById("moreDevice").style.display = "none";
      device = devices[0]
      document.getElementById("deviceName").innerHTML = device.model;
      document.getElementById("deviceID").innerHTML = device.id;
    }
    else if (devices.length !== 1) {
      document.getElementById("anyDevice").style.display = "none";
      document.getElementById("moreDevice").style.display = "block";
      let deviceList = document.getElementById("deviceList");
      deviceList.innerHTML = "";
      devices.forEach((device) => {
        let li = document.createElement("li");
        li.innerHTML = device.model;
        li.setAttribute("id", device.id);
        li.onclick = function() {
          device = device
          document.getElementById("deviceName").innerHTML = device.model;
          document.getElementById("deviceID").innerHTML = device.id;
        }
        deviceList.appendChild(li);
      });
      
    }
  }
}

updateDevices()