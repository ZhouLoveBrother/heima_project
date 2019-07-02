// 引入axios
import axios from 'axios'

//设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 处理post请求发送,实现用户登录验证
export const login = (data) => {
    return axios({
        method: 'post',
        url: 'login',
        data,
    })
}

