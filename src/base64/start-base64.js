const startBase64 = (tasks, finished, failed, last) => {
  Promise
    .all(tasks.map(task => task()))
    .then(value => finished(value))
    .catch(reason => failed(reason))
    .finally(() => last())
}

export default startBase64