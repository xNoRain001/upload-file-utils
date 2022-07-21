import request from "../request"

const merge = (mergeAPI, hash, sliceCount, sucStatus) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await request({
        url: mergeAPI,
        method: 'POST',
        data: {
          HASH: hash,
          count: sliceCount
        },
        headers: {
          post: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      })
  
      if (response.status == sucStatus) {
        resolve(response)
  
        return
      }
  
      reject(response)
    } catch (error) {
      reject(error)
    }
  })
}

export default merge