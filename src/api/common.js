// 引入axios
import axios from 'axios'

// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 添加请求拦截器------服务器需要token值才可以获取数据，所以设置拦截器，每个路由跳转都附带token值访问服务器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么?手动传递token
  // 1.获取token
  var token = localStorage.getItem('heima_user_token')
  if (token) {
    // 2.必须在请求头中使用 Authorization 字段提供 token 令牌
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

export default axios
