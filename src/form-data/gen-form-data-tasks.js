import { genHash } from "../utils"
import request from "../request"

const genFormDataTasks = async (
  files, url, isGenHash, sucStatus, onProgress
) => {
  const tasks = []

  for (let i = 0, l = files.length; i < l; i++) {
    const file = files[i]
    const filename = isGenHash
      ? (await genHash(file)).filename
      : file.name
    const formData = new FormData()

    formData.append('file', file)
    formData.append('filename', filename)

    const task = () => {
      return new Promise(async (resolve, reject) => {
        try {
          const response = await request({
            url, 
            method: 'POST',
            data: formData,
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

export default genFormDataTasks