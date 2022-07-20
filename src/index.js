import request from './request/index'
import { noop, img2Base64, genHash } from './utils'

class Uploader {
  async formData (options = {}) {
    const {
      files,
      url,
      sucStatus,
      generateHash = false,
      beforeStart = noop,
      onProgress = noop,
      finished = noop, 
      failed = noop,
      finally: last = noop
    } = options
    const tasks = []

    for (let i = 0, l = files.length; i < l; i++) {
      const file = files[i]
      const filename = generateHash
        ? await genHash(file)
        : file.name
      const formData = new FormData()
  
      formData.append('file', file)
      formData.append('filename', filename)

      // create task
      const task = () => {
        return request({
          url, 
          method: 'POST',
          data: formData,
          onUploadProgress (e) {
            const { loaded, total } = e

            onProgress(loaded, total)
          },
        })
          .then(response => {
            if (response.status == sucStatus) {
              return Promise.resolve(response)
            }
              
            return Promise.reject(response)
          })
          .catch(e => Promise.reject(e))
      }

      tasks.push(task)
    }

    beforeStart()

    Promise
      .all(tasks.map(task => task()))
      .then(value => finished(value))
      .catch(reason => failed(reason))
      .finally(() => last())
  }

  async base64 (options = {}) {
    const {
      files,
      url,
      sucStatus,
      generateHash = false,
      beforeStart = noop, 
      onProgress = noop,
      finished = noop, 
      failed = noop,
      finally: last = noop
    } = options
    const tasks = []

    for (let i = 0, l = files.length; i < l; i++) {
      const file = files[i]
      const filename = generateHash
        ? await genHash(file)
        : file.name
      const base64 = await img2Base64(file)
      const task = () => {
        return request({
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
          .then(response => {
            if (response.status == sucStatus) {
              return Promise.resolve(response)
            }
              
            return Promise.reject(response)
          })
          .catch(e => {
            Promise.reject(e)
          })
      }

      tasks.push(task)
    }

    beforeStart()

    Promise
      .all(tasks.map(task => task()))
      .then(value => finished(value))
      .catch(reason => failed(reason))
      .finally(() => last())
  }
}

export default Uploader