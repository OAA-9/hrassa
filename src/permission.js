// 权限拦截在路由跳转 导航守卫

import router from '@/router'
import store from '@/store'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 定义白名单  所有不受权限控制的页面
const whiteList = ['/login', '/404']
router.beforeEach((to, from, next) => {
// 开启进度条
  nProgress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      // 如果访问的是登录页
      next('/')
    } else {
      next()
    }
  } else {
    // 没有token的情况下
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
    // 解决手动切换进度条时 进度条不关闭的问题
    nProgress.done()
  }
})

router.afterEach(() => {
  nProgress.done()
})
