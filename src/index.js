import request from './request/index'
import { noop } from './utils'

class Uploader {
  formdata (options = {}) {
    const {
      file,
      filename = file.name, 
      url,
      sucStatus,
      beforeStart = noop, 
      finished = noop, 
      failed = noop,
      finally: last = noop
    } = options
    const formData = new FormData()
  
    formData.append('file', file)
    formData.append('filename', filename)
  
    beforeStart()
  
    // read to upload
    request
      .post(url, formData)
      .then(response => {
        if (response.status == sucStatus) {
          finished()
        } else {
          return Promise.reject(response)
        }
      })
      .catch(e => failed(e))
      .finally(() => last())
  }
}

export default Uploader