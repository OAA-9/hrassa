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
        // async函数return的内容，用await就可以接收到
        const { roles } = await store.dispatch('user/getUserInfo')
        // 为什么要写await 因为我们想获取完资料再去放行
        // 筛选用户的可用路由
        const routes = await store.dispatch('permisssion/filterRoutes', roles.menus)
        // 将动态路由添加到路由表中
        router.addRoutes([...routes,
          { path: '*', redirect: '/404', hidden: true }])
      }
      // 添加完动态路由之后
      next(to.path) // 相当于跳到对应的地址  相当于多做一次跳转 为什么要多做一次跳转
      // 进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
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
