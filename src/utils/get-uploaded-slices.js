import request from "../request/index"

const getUploadedSlices = async (api, hash, name) => {
  const { data } = await request({
    url: api,
    method: 'GET',
    params: {
      HASH: hash
    }
  })
  const uploadedSlices = data[name]

  return uploadedSlices
}

export default getUploadedSlices