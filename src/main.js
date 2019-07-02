import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'

// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入初始化文件css
import '@/styles/index.less'
// 使用UI
Vue.use(ElementUI)

// 设置路由导航守卫
router.beforeEach((to, from, next) => {
  // 获取token进行验证是否登录
  var token = localStorage.getItem('heima_user_token')
  // 进行判断
  if (token || to.path == '/login') {
    next() // 必须调用该方法
  } else if (!token && to.path !== '/login') {
    next({ name: 'Login' })
  }
})

Vue.config.productionTip = false

new Vue({
  // 注入路由
  router,
  render: h => h(App)
  // $mount 相当于el 模板指定
}).$mount('#app')
