import request from "../request/index"

const getUploadedSlices = (uploadedAPI, hash, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await request({
        url: uploadedAPI,
        params: {
          HASH: hash
        }
      })
      const uploadedSlices = data[name]

      resolve(uploadedSlices)
    } catch (error) {
      reject(error)
    }
  })
}

export default getUploadedSlices