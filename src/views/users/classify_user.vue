<template>
  <div class="classUser">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <div style="margin: 15px 0;">
      <el-input
        v-model="query"
        placeholder="请输入内容"
        class="input-with-select"
        style="width:300px;margin-right:15px"
        @keyup.enter.native="search"
      >
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <el-button type="success" @click="showaddUsers">添加用户</el-button>
    </div>
    <!-- 表格区域 -->
    <el-table :data="userList" style="width: 100%" border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="280"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="280"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeUserState(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- scope.row 这个值可以获取当前的对象的数据源 -->
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialogrant(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="primary" icon="el-icon-share" @click="showGrandDialogrant(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete" @click="delUserById(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页按钮 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1,2,3,4,5]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加用户框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :label-width="'80px'" ref="addForm" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色弹框 -->
    <el-dialog title="分配角色" :visible.sync="grantDialogFormVisible">
      <el-form :model="grantForm" :label-width="'80px'" ref="grantForm" :rules="rules">
        <el-form-item label="用户名">
          <el-input v-model="grantForm.username" auto-complete="off" disabled style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="grantForm.rid" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRoleSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户弹框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :label-width="'80px'" ref="editForm" :rules="rules">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入获取用户列表数据请求---------
import {
  getUserList,
  addUsers,
  updataUser,
  delUser,
  grantUserRole,
  editUser
} from '@/api/admin_user.js';
// 引入角色用户数据请求
import { getAllRoleLlist } from '@/api/admin_role.js';

export default {
  data () {
    return {
      // 编辑用户show
      editDialogFormVisible: false,
      // 添加用户show
      addDialogFormVisible: false,
      // 分配角色show
      grantDialogFormVisible: false,
      // 编辑用户数据源
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      // 分配角色数据源
      grantForm: {
        username: '',
        rid: '',
        id: ''
      },
      // 分配角色下拉菜单数据源
      roleList: [],
      // 添加用户数据表单
      addForm: {
        username: '',
        password: '',
        email: 'a@b.com',
        mobile: '13456789098'
      },
      // 用户列表参数-----
      // 用户搜索关键字
      query: '',
      // 当前页码
      pagenum: 1,
      //   每页显示的记录数
      pagesize: 3,
      // 总记录数
      total: 0,
      // 状态开关

      // 数据列表
      userList: [],
      // 添加用户表单验证
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '请输入 6 到 16 位数字的密码',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur',
            pattern: /\w+[@]\w+[.]\w{2,3}/
          }
        ],
        mobile: [
          { required: true, message: '请填写手机号', trigger: 'blur' },
          {
            pattern: /^1[345678]\d{9}$/,
            message: '请填写正确的手机号(11位数字)',
            trigger: 'blur'
          }
        ]
      }
    }
  },

  // 钩子函数
  mounted () {
    this.init()

    getAllRoleLlist().then(res => {
      if (res.data.meta.status === 200) {
        this.roleList = res.data.data
      }
    })
  },
  // 方法集合
  methods: {
    // 编辑用户框内容显示
    showEditDialogrant (row) {
      console.log(row)
      console.log(typeof row.id)
      this.editDialogFormVisible = true
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },
    // 编辑用户设置提交
    editUser () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          editUser(this.editForm)
            .then(res => {
              if (res.data.meta.status === 200) {
                this.editDialogFormVisible = false
                this.$message({
                  type: 'success',
                  message: '编辑成功'
                })
                this.init()
              } else {
                this.$message({
                  type: 'warning',
                  message: '用户输入不合法'
                })
              }
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: res.data.meta.msg
              })
            })
        } else {
          return false
        }
      })
    },
    // 分配角色框显示----
    showGrandDialogrant (row) {
      this.grantDialogFormVisible = true
      this.grantForm.username = row.username
      this.grantForm.id = row.id
      // 实现下拉列表选项的展示展示
      this.grantForm.rid = row.rid
    },
    // 分配角色 设置提交----
    grantRoleSubmit () {
      // 判断是否选择了角色
      if (!this.grantForm.rid) {
        this.$message({
          type: 'warning',
          message: '请先选择角色'
        })
        return false
      }
      grantUserRole(this.grantForm.id, this.grantForm.rid).then(res => {
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'warning',
            message: res.data.meta.msg
          })
          this.grantDialogFormVisible = false
          this.init()
        }
      })
    },
    // 修改用户状态，上传数据
    changeUserState (id, type) {
      // 修改状态请求
      updataUser(id, type)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 删除表格单个用户
    delUserById (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delUser(id)
            .then(res => {
              // 点击确定触发
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                // 判断本次删除之后，当前页还有没有数据，如果有数据，就保持页码为当前页，否则就到上一页
                this.pagenum =
                  Math.ceil((this.total - 1) / this.pagesize) < this.pagenum
                    ? --this.pagenum
                    : this.pagenum
                // 重置页面
                this.init()
              }
            })
            .catch(err1 => {
              // 当嵌套的时候，多个err会冲突 ，修改其中一个名
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            })
        })
        .catch(() => {
          // 点击取消触发
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 弹出添加用户框
    showaddUsers () {
      this.addDialogFormVisible = true
    },
    // 实现新增用户添加
    addUser () {
      // 提交数据前，再次验证表单
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addUsers(this.addForm)
            .then(res => {
              if (res.data.meta.status === 201) {
                // 对话框隐藏
                this.addDialogFormVisible = false
                // 重置表单元素的数据
                this.$refs.addForm.resetFields()
                // 实现数据 刷新
                this.init()
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
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
        } else {
          // 错误则打断提交
          return false
        }
      })
    },
    //   搜索框初始化
    search () {
      this.pagenum = 1
      this.init()
    },
    //   数据初始化
    init () {
      // 发送请求获取用户数据---封装
      getUserList({
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
        .then(res => {
          // console.log(res)
          this.userList = res.data.data.users
          this.total = res.data.data.total
        })
        .catch(err => {
          console.error(err)
        })
    },

    // 切换size下拉列表时触发
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      //   重置 pagesize
      this.pagesize = val
      // 再次拉取数据
      this.init()
    },
    // 切换表格当前页码
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.init()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
