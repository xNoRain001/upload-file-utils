const genUploadedSlicesMap = uploadedSlices => {
  const uploadedSlicesMap = {}

  for (let i = 0, l = uploadedSlices.length; i < l; i++) {
    uploadedSlicesMap[uploadedSlices[i]] = true
  }

  return uploadedSlicesMap
}

export default genUploadedSlicesMap