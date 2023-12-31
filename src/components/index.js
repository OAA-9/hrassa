// 负责所有的全局自定义组件的注册
import PageTools from './PageTools/index.vue'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import print from 'vue-print-nb'
import ScreenFull from './ScreenFull'
import ThemePicker from './ThemePicker'
import LangSelect from './lang'
import TagsView from './TagsView'

export default {
  install (Vue) {
    // 组件注册
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload) // 注册导入上传组件
    Vue.use('print', print)
    Vue.component('ScreenFull', ScreenFull)
    Vue.component('ThemePicker', ThemePicker)
    Vue.component('LangSelect', LangSelect)
    Vue.component('TagsView', TagsView)
  }
}
