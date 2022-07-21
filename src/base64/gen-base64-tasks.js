import { genHash, img2Base64 } from "../utils"
import request from "../request"

const genBase64Tasks = async (
  files, url, isGenHash, sucStatus, onProgress
) => {
  const tasks = []

  for (let i = 0, l = files.length; i < l; i++) {
    const file = files[i]
    const filename = isGenHash
      ? (await genHash(file)).filename
      : file.name
    const base64 = await img2Base64(file)
    const task = () => {
      return new Promise(async (resolve, reject) => {
        try {
          const response = await request({
            url,
            method: 'POST',
            data: {
              file: encodeURIComponent(base64),
              filename
            },
            headers: {
              post: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            },
            onUploadProgress (e) {
              const { loaded, total } = e
    
              onProgress(loaded, total)
            },
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

    tasks.push(task)
  }

  return Promise.resolve(tasks)
}

export default genBase64Tasks