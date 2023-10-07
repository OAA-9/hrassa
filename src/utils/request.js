import axios from 'axios'
import { Message } from 'element-ui'
const service = axios.create({
  // 当执行  npm run dev => .evn.development => /api=>跨域代理
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})
service.interceptors.request.use()
service.interceptors.response.use(response => {
  // 给axios默认加一层data
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, error => {
  Message.error(error.message)
  return Promise.reject(error)
})

export default service
