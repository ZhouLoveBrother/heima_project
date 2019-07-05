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

// 处理post请求发送,实现用户登录验证
export const login = (data) => {
  return axios({
    method: 'post',
    url: 'login',
    data
  })
}

// get方式请求用户列表的数据
export const getUserList = (pa) => {
  return axios({
    url: 'users',
    params: pa
  })
}

// 添加用户请求--post请求
export const addUsers = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}

// 修改用户状态 -- put请求
export const updataUser = (id, type) => {
  return axios({
    url: `users/${id}/state/${type}`,
    method: 'put'
  })
}

// 删除表格单个用户--
export const delUser = (id) => {
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}

// 分配角色--put请求
export const grantUserRole = (id, rid) => {
  return axios({
    url: `users/${id}/role`,
    method: 'put',
    data: {
      rid
    }
  })
}

// 编辑用户提交--put
export const editUser = (data) => {
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data
  })
}
