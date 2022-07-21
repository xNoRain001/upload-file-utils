import merge from "./merge"

const start = (
  tasks, mergeAPI, hash, sliceCount, sucStatus,
  finished, failed, last
) => {
  Promise
    .all(tasks.map(task => task()))
    .then(async () => {

      // all tasks have been done, merge slices.
      const response = await merge(mergeAPI, hash, sliceCount, sucStatus)
      
      if (response.status == sucStatus) {
        finished(response)

        return
      }

      failed(response)
    })
    .catch(reason => failed(reason))
    .finally(() => last())
}

export default start