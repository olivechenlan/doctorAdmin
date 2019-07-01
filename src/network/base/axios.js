// 定义网络请求
import Axios from 'axios'

// 配置axios
const options = {
  // baseURL: process.env.VUE_APP_BASE_API,
  timeout: 30000
}

// 创建axios实例
const axios = Axios.create(options)

// 请求拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // 判断请求异常信息中是否含有超时timeout字符串
    if (error.message.includes('timeout')) {
      return Promise.reject('请求超时，请刷新重试')
    }
    if (error.message.includes('504')) {
      return Promise.reject('服务开小差了，请刷新重试')
    }
    return Promise.reject(error)
  }
)

// 请求
export default axios
