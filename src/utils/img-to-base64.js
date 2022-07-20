const img2Base64 = async img => {
  return new Promise(resolve => {
    const fileReader = new FileReader()

    fileReader.readAsDataURL(img)
    fileReader.onload = function (e) {
      resolve(e.target.result)
    }
  })
}

export default img2Base64