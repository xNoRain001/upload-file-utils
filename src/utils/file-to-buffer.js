const file2Buffer = img => {
  return new Promise(resolve => {
    const fileReader = new FileReader()

    fileReader.readAsArrayBuffer(img)
    fileReader.onload = function (e) {
      resolve(e.target.result)
    }
  })
}

export default file2Buffer