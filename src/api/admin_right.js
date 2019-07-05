// 专门处理role角色管理
import axios from '@/api/common.js'

// 获取所有权限列表数据
export const getRightList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}
