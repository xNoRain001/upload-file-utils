import request from './request'
import { 
  noop, 
  img2Base64, 
  genHash
} from './utils'
import { 
  getUploadedSlices, 
  genUploadedSlicesMap, 
  formatSliceConfig, 
  genSlices,
  genTasks,
  start,
  merge
} from './slice'

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
        ? (await genHash(file)).filename
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
            const value = (loaded / total).toFixed(2)

            onProgress(value)
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
        ? (await genHash(file)).filename
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
            const value = (loaded / total).toFixed(2)

            onProgress(value)
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

  async slice (options = {}) {
    const {
      files,
      url,
      uploadedAPI,
      mergeAPI,
      name,
      sucStatus,
      sliceLimit = 100,
      sliceSize = 10 * 1024 * 1024,
      beforeStart = noop, 
      onProgress = noop,
      finished = noop, 
      failed = noop,
      finally: last = noop
    } = options
    const file = files[0]

    const { hash, suffix } = await genHash(file)

    // get uploaded slices by hash
    const uploadedSlices = await getUploadedSlices(uploadedAPI, hash, name)

    // generate uploaded slices map for exclude uploaded slices
    const uploadedSlicesMap = genUploadedSlicesMap(uploadedSlices)

    // format slice size and slice count because slice count may be greater
    // than slice limit
    const { 
      formattedSliceSize, formattedSliceCount
    } = formatSliceConfig(file, sliceSize, sliceLimit)

    // generate slices that to be uploaded 
    const slices = genSlices(
      file, uploadedSlicesMap, formattedSliceSize, 
      formattedSliceCount, hash, suffix, onProgress
    )

    // generate tasks
    const tasks = genTasks(slices, url, sucStatus)

    beforeStart()

    if (tasks.length) {

      // start upload
      start(
        tasks, mergeAPI, hash, formattedSliceCount, sucStatus,
        finished, failed, last
      )
      
      return
    }

    // all slices have been uploaded, just need to merge them.
    merge(mergeAPI, hash, formattedSliceCount, sucStatus)
  }
}

export default Uploader