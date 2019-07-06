<template>
  <div class="roleList">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" round style="margin-bottom:15px;">添加角色</el-button>
    <!-- 表格区域 -->
    <el-table :data="roleList" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 栅格系统 展开行   scope=props, 相当于res.data.data-->
          <el-row
            v-for="first in scope.row.children"
            :key="first.id"
            style="margin-bottom:10px;border-bottom:1px #ccc dashed;"
          >
            <el-col :span="4">
              <el-tag
                closable
                type="success"
                @close="delRoleRight(scope.row,third.id)"
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="success"
                    @close="delRoleRight(scope.row,third.id)"
                  >{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="info"
                    v-for="third in second.children"
                    :key="third.id"
                    style="margin-right:4px;margin-bottom:6px"
                    @close="delRoleRight(scope.row,third.id)"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-show="scope.row.children.length === 0">没有任何的权限，请先去分配</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- scope.row 这个值可以获取当前的对象的数据源 -->
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" @click="showEdit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
            <el-button type="primary" icon="el-icon-share" @click="showDialogVisible(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete" @click="delRole(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑用户弹框 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :label-width="'80px'" ref="editForm">
        <el-form-item label="用户名">
          <el-input v-model="editForm.roleName" auto-complete="off" disabled style="width:130px"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限树状图 -->
    <el-dialog title="授权角色" :visible.sync="dialogVisible">
      <span slot="footer" class="dialog-footer">
        <el-tree
          ref="mytree"
          :data="rightList"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="checkedArr"
          :props="defaultProps"
        ></el-tree>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllRoleLlist,
  delRight,
  editRoleData,
  delRole,
  editRoleRight
} from '@/api/admin_role.js';
// 所有权限数据引入
import { getRightList } from '@/api/admin_right.js';
export default {
  data () {
    return {
      // 树状图展示
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 分配权限对话框 show
      dialogVisible: false,
      // 编辑对话框 show
      editDialogFormVisible: false,
      // 编辑角色数据源
      editForm: {
        roleName: '',
        roleDesc: '',
        id: ''
      },
      // 角色表格&展开行数据源
      roleList: [],
      // 树状图数据源
      rightList: [],
      // 分配权限的角色ID
      roleId: '',
      // 树状图--默认被选中的权限
      checkedArr: []
    }
  },
  // 方法集合
  methods: {
    // show 分配权限对话框 ,以及角色拥有的权限默认选中
    showDialogVisible (row) {
      this.dialogVisible = true
      // 点击对应角色的时候，保存角色ID
      this.roleId = row.id
      // 角色权限所有数据
      getRightList('tree')
        .then(res => {
          console.log(res)
          this.rightList = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
      // 循环遍历角色所拥有的权限，获取权限ID，数组的形式传递给树状模板
      // 每次遍历前将之前可能的权限id清空
      this.checkedArr.length = 0
      row.children.forEach((first, index) => {
        if (first.children && first.children.length > 0) {
          // 遍历二级权限
          first.children.forEach((second, jack) => {
            if (second.children && second.children.length > 0) {
              // 遍历三级权限
              second.children.forEach((third, sum) => {
                this.checkedArr.push(third.id)
              })
            }
          })
        }
      })
    },
    // 角色权限分配功能实现
    editRoleRight () {
      let temp = []
      // 先使用UI组件提供的方法获取所有选中checked的权限ID，因上传数据不是对象就是字符串，最后将ID数组转化成字符串上传
      var arr = this.$refs.mytree.getCheckedNodes()
      // console.log(arr)
      // 循环遍历，获取权限id和父权限pid,两个拼接
      for (var i = 0; i < arr.length; i++) {
        temp.push(arr[i].id + ',' + arr[i].pid)
      }
      // temp为：['12,20,30','20,50,60,'],需要转成字符串
      var str = temp.join(',')
      // 去除相同的父权限PID，  new Set（） 只能用数组才可以用,  new Set:{109,107,102,154}
      var arr2 = str.split(',')
      //   ...可以将对象的成员展开为一个一个值 [109,107,102,154]
      var finaArr = [...new Set(arr2)]
      // 上传id 提交权限分配,上传字符串，再次转换
      editRoleRight(this.roleId, finaArr.join(','))
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            // 重置
            this.dialogVisible = false
            this.init()
          } else {
            this.$message({
              type: 'error',
              message: res.data.meta.msg
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // show 编辑对话框
    showEdit (row) {
      this.editDialogFormVisible = true
      this.editForm.roleName = row.roleName
      this.editForm.roleDesc = row.roleDesc
      this.editForm.id = row.id
    },
    // 编辑角色上交
    editRole () {
      console.log(this.editForm)
      editRoleData(this.editForm)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: '编辑成功'
            })
            this.editDialogFormVisible = false
            this.init()
          } else {
            this.$message({
              type: 'error',
              message: res.data.meta.msg
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 删除指定角色
    delRole (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 提交数据--删除角色
          delRole(id)
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })
                this.init()
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '删除失败'
          })
        })
    },
    // 删除角色--指定权限
    delRoleRight (row, rightId) {
      console.log(row)
      delRight(row.id, rightId)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
          }
          // 重置角色权限的数据源
          row.children = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 数据初始化
    init () {
      // 获取角色列表所有数据
      getAllRoleLlist()
        .then(res => {
          if (res.data.meta.status === 200) {
            console.log(res)
            this.roleList = res.data.data
          } else {
            this.$message({
              type: 'error',
              message: res.data.meta.msg
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  // 钩子函数
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
