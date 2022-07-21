const formatSliceConfig = (file, sliceSize, sliceLimit) => {
  const { size } = file
  const sliceCount = Math.ceil(size / sliceSize)

  if (sliceCount > sliceLimit) {

    // format slice size
    sliceSize = size / sliceLimit

    return {
      formattedSliceSize: sliceSize,
      formattedSliceCount: sliceLimit // slice count equal slice limit
    }
  }

  return {
    formattedSliceSize: sliceSize,
    formattedSliceCount: sliceCount
  }
}

export default formatSliceConfig