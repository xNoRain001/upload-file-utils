import request from './request/index'
import { noop, img2Base64 } from './utils'

class Uploader {
  formData (options = {}) {
    const {
      files,
      url,
      sucStatus,
      beforeStart = noop,
      onProgress = noop,
      finished = noop, 
      failed = noop,
      finally: last = noop
    } = options
    const tasks = []

    for (let i = 0, l = files.length; i < l; i++) {
      const file = files[i]
      const formData = new FormData()
  
      formData.append('file', file)
      formData.append('filename', file.name)

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
      beforeStart = noop, 
      onProgress = noop,
      finished = noop, 
      failed = noop,
      finally: last = noop
    } = options
    const tasks = []

    for (let i = 0, l = files.length; i < l; i++) {
      const file = files[i]
      const base64 = await img2Base64(file)
      const task = () => {
        return request({
          url,
          method: 'POST',
          data: {
            file: encodeURIComponent(base64),
            filename: file.name
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