import { 
  noop, 
  genHash
} from './utils'
import { 
  getUploadedSlices, 
  genUploadedSlicesMap, 
  formatSliceConfig, 
  genSlices,
  genSliceTasks,
  startSlice,
  merge
} from './slice'
import { 
  genFormDataTasks, 
  startFormData 
} from './form-data'
import startBase64 from './base64/start-base64'
import { genBase64Tasks } from './base64'
import request from './request'

class Uploader {
  async formData (options = {}) {
    const {
      files,
      url,
      sucStatus,
      isGenHash = false,
      beforeStart = noop,
      onProgress = noop,
      finished = noop, 
      failed = noop,
      finally: last = noop
    } = options

    const tasks = await genFormDataTasks(
      files, url, isGenHash, sucStatus, onProgress
    )

    beforeStart()

    // start uplaod
    startFormData(tasks, finished, failed, last)
  }

  async base64 (options = {}) {
    const {
      files,
      url,
      sucStatus,
      isGenHash = false,
      beforeStart = noop, 
      onProgress = noop,
      finished = noop, 
      failed = noop,
      finally: last = noop
    } = options
    
    const tasks = await genBase64Tasks(
      files, url, isGenHash, sucStatus, onProgress
    )

    beforeStart()

    console.log(tasks)

    // start upload
    startBase64(tasks, finished, failed, last)
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
    const tasks = genSliceTasks(slices, url, sucStatus)

    beforeStart()

    if (tasks.length) {

      // start upload
      startSlice(
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