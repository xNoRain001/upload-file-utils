import SparkMD5 from "spark-md5"
import file2Buffer from "./file-to-buffer"

const genHash = async file => {
  const suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[0]

  const buffer = await file2Buffer(file)
  const spark = new SparkMD5.ArrayBuffer()
  spark.append(buffer)
  const hash = spark.end()

  return `${ hash }${ suffix }`
}

export default genHash