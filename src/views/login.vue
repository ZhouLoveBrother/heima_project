<template>
  <div class="login">
    <div class="container">
      <img src="../assets/avatar.jpg" alt class="avatar" />
      <el-form :model="loginForm" :rules="rules" ref="loginForm" class="demo-ruleForm">
        <!-- 用户名验证 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            clearable
            prefix-icon="myicon myicon-user"
          ></el-input>
        </el-form-item>
        <!-- 用户密码验证 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password "
            placeholder="请输入密码"
            clearable
            type="password"
            prefix-icon=" myicon myicon-key"
            @keyup.enter.native="loginCheck"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="loginCheck">登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 在script中进行模块方法的引入 login.js用户验证
import { login } from '@/api/admin_user.js'

export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      // runles 为验证规则，需要写入需要验证的字段，官网查看
      rules: {
        // 用户名验证
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        // 用户密码验证
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码必须在6~16位之间', trigger: 'blur' }
        ]
      }
    }
  },
  // 方法集
  methods: {
    // 登录验证
    loginCheck () {
      //   可以调用当前表单的validate函数，当验证完毕的时候，会调用这个函数中的回调函数,它有一个valid的参数
      // 这个参数就是用来标记当前验证是否通过，如果为true,则通过，否则不通过
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 调用psot请求服务器，进行登录验证
          login(this.loginForm)
            .then(res => {
              if (res.data.meta.status === 200) {
                console.log(res)
                //   将token数据存储到本地
                localStorage.setItem('heima_user_token', res.data.data.token)
                // 跳转后台主页
                this.$router.push({ name: 'Index' })
              } else {
                // 这个else是发送请求成功，然后服务器这边有一些其他报警
                this.$message({
                  type: 'warning',
                  message: res.data.meta.msg
                })
              }
            }) // catch 这个是浏览器发送失败的报警
            .catch(err => {
              console.error(err)
            })
        } else {
          this.$message({
            message: '用户名或者密码错误，请重新登录',
            type: 'error'
          })
          // 必须返回false ，才能验证失败的时候打断跳转和登录
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 50%;
      margin-left: 90px;
    }
  }
}
</style>
