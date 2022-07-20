import axios from 'axios/dist/axios'
import qs from 'qs'

const request = axios.create()

request.defaults.transformRequest = (data, headers) => {
  if (headers.post['Content-Type'] === 'application/x-www-form-urlencoded') {
    return qs.stringify(data)
  }

  return data
}

export default request

