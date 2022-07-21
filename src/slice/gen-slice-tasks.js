import request from "../request"

const genSliceTasks = (slices, url, sucStatus) => {
  const tasks = []

  for (let i = 0, l = slices.length; i < l; i++) {
    const { file, filename } = slices[i]
    const formData = new FormData()

    formData.append('file', file)
    formData.append('filename', filename)

    tasks.push(async () => {
      return new Promise(async (resolve, reject) => {
        try {
          const response = await request({
            url,
            method: 'POST',
            data: formData
          })

          if (response.status == sucStatus) {
            // onProgress()

            return resolve(response)
          }

          reject(response)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  return tasks
}

export default genSliceTasks