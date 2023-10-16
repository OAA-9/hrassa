import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index' // global css

import App from './App'
import store from './store'
import router from './router'
import components from './components'

import * as directives from '@/directives'
import * as filters from '@/filters' // 引入工具类
import checkPermission from '@/mixin/checkPermission'
import i18n from '@/lang'

import '@/icons' // icon
import '@/permission' // permission control

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.use(ElementUI, {
  // element本身支持i18n的处理
  i18n: (key, value) => i18n.t(key, value)

})
// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach((key) => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})

// 注册自定义过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 注册自定义组件
Vue.use(components)
// 全局混入检查对象
Vue.mixin(checkPermission) // 表示所有的组件都拥有了检查的方法
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: (h) => h(App)
})
