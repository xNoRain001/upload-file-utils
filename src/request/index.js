import axios from 'axios/dist/axios'

const request = axios.create()

request.defaults.headers.post['Content-Type'] = 'multipart/form-data'

export default request

