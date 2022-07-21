const genSlices = (
  file,
  uploadedSlicesMap, 
  sliceSize,
  sliceCount, 
  hash, 
  suffix, 
  onProgress
) => {
  const slices = []
  let index = 0

  while (index < sliceCount) {
    const slice = file.slice(sliceSize * index, sliceSize * (index + 1))
    const filename =`${ hash }_${ index + 1 }${ suffix }`
    
    index++

    // Slices that already exist on the server
    if (uploadedSlicesMap[filename]) {
      onProgress()
      continue
    }

    slices.push({
      file: slice,
      filename
    })
  }

  return slices
}

export default genSlices