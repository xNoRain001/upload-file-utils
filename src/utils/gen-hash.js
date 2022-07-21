import SparkMD5 from "spark-md5"
import file2Buffer from "./file-to-buffer"

const genHash = file => {
  return new Promise(async (resolve, reject) => {
    try {
      const suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[0]
      const buffer = await file2Buffer(file)
      const spark = new SparkMD5.ArrayBuffer()
      const hash = spark.append(buffer).end()

      return resolve({
        hash,
        suffix,
        filename: `${ hash }${ suffix }`
      })
    } catch (error) {
      reject(error)
    }
  })
}

export default genHash