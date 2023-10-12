// 负责所有的全局自定义组件的注册
import PageTools from './PageTools/index.vue'
import UploadExcel from './UploadExcel'

export default {
  install (Vue) {
    // 组件注册
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
  }
}
