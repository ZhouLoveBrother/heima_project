// 专门处理role角色管理
import axios from '@/api/common.js'
// 获取所有角色列表数据
export const getAllRoleLlist = () => {
  return axios({
    url: 'roles'
  })
}
