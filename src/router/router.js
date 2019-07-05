// 引入vue
import Vue from 'vue'
// 引入路由
import VueRouter from 'vue-router'
// 引入登录组件
import Login from '@/views/login.vue'
// 引入 后台主页组件
import Index from '@/views/index.vue'
// 引入 后台主页默认子组件
import WellCome from '@/views/wellcome.vue'
// 引入 后台主页： 用户列表
import ClassIfyUser from '@/views/users/classify_user.vue'
// 引入 后台主页 :  角色列表
import Role from '@/views/right/roleList.vue'
// 引入 后台主页 :  权限列表
import Right from '@/views/right/rightList.vue'

// 使用路由
Vue.use(VueRouter)

// 创建路由对象
var router = new VueRouter({
  routes: [
    // 重定向
    {
      path: '/',
      redirect: {
        name: 'Index'
      }
    },
    // 用户登录
    {
      name: 'Login',
      path: '/login',
      component: Login
    },
    // 后台主页
    {
      name: 'Index',
      path: '/index',
      component: Index,
      redirect: {
        path: '/index/wellcome'
      },
      // 嵌套路由，
      children: [
        // 主页默认显示子组件
        {
          name: 'WellCome',
          path: 'wellcome',
          component: WellCome
        },
        // 用户列表
        {
          name: 'ClassIfyUser',
          path: 'classIfyUser',
          component: ClassIfyUser
        },
        // 权限管理--》角色列表
        {
          name: 'Role',
          path: 'role',
          component: Role
        },
        // 权限管理--》 权限列表
        {
          name: 'Right',
          path: 'right',
          component: Right
        }
      ]
    }
  ]

})

// 暴露router导出
export default router
