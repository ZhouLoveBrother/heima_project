// 专门处理role角色管理
import axios from '@/api/common.js'
// 获取所有角色列表数据
export const getAllRoleLlist = () => {
  return axios({
    url: 'roles'
  })
}

// 删除角色指定的权限
export const delRight = (roleId, rightId) => {
  return axios({
    method: 'delete',
    url: `roles/${roleId}/rights/${rightId}`
  })
}

// 编辑角色信息提交
export const editRoleData = (data) => {
  return axios({
    method: 'put',
    url: `roles/${data.id}`,
    data
  })
}
// 删除角色
export const delRole = (id) => {
  return axios({
    method: 'delete',
    url: `roles/${id}`
  })
}

// 提交角色的权限分配数据
export const editRoleRight = (roleId, rids) => {
  return axios({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: { rids }
  })
}
