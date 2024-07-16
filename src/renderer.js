const func = async () => {
    const response = await window.versions.device()
    console.log(response) 
  }
  
func()