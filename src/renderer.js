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
  }
}

updateDevices()