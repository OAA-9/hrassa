// 权限拦截在路由跳转 导航守卫

import router from '@/router'
import store from '@/store'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 定义白名单  所有不受权限控制的页面
const whiteList = ['/login', '/404']
router.beforeEach(async (to, from, next) => {
// 开启进度条
  nProgress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      // 如果访问的是登录 直接跳转到首页
      next('/')
    } else {
      // 只有放过的时候才有必要获取用户资料
      // 如果当vuex中有用户的资料id表示已经有资料了，不需要获取了如果没有id才需要获取
      if (!store.getters.userId) {
        // 如果没有id这个值 才会调用 vuex的获取资料的action
        await store.dispatch('user/getUserInfo')
        // 为什么要写await 因为我们想获取完资料再去放行
      }
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
