// 引入vue
import Vue from 'vue'
// 引入路由
import VueRouter from 'vue-router'
// 引入登录组件
import Login from '@/views/login.vue'
// 引入 后台主页组件
import Index from '@/views/index.vue'

// 使用路由
Vue.use(VueRouter)

// 创建路由对象
var router = new VueRouter({
  routes: [
    // 重定向
    {
      path: '/',
      redirect: { name: 'Index' }
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
      component: Index
    }
  ]

})

// 暴露router导出
export default router
