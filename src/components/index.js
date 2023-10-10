// 负责所有的全局自定义组件的注册
import PageTools from './PageTools/index.vue'

export default {
  install (Vue) {
    // 组件注册
    Vue.component('PageTools', PageTools)
  }
}
