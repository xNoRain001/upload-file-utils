const formatSliceConfig = (file, sliceSize, sliceLimit) => {
  const { size } = file
  const sliceCount = Math.ceil(size / sliceSize)

  if (sliceCount > sliceLimit) {

    // format slice size
    sliceSize = size / sliceLimit

    return {
      sliceSize,
      sliceLimit // slice count equal slice limit
    }
  }

  return {
    sliceSize,
    sliceCount
  }
}

export default formatSliceConfig