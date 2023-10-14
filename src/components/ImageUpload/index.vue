<template>
  <div>
    <!-- 给action一个#,避免报错 -->
    <!-- file-list是上传的文件列表，可以绑定到上传组件上，让上传组件显示-->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :before-upload="beforeUpload"
      :http-request="upload"
      :file-list="fileList"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :class="{disabled: fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="showDialog">
      <img
        :src="imgUrl"
        style="width:100%"
      >
    </el-dialog>
    <el-progress
      v-if="showPercent"
      style="width: 180px"
      :percentage="percent"
    />
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  // 需要把id和key改成自己的信息 具体查看https://console.cloud.tencent.com/cam/capi
  SecretId: 'AKIDKdo5KUeaHk02p014waAAxYw96oHXcdUG', // 身份识别 ID
  SecretKey: 'fGnCfvxkJct0tYf7NQHtHRl1FH5i6Jfp' // 身份密钥
})

export default {
  data () {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: '',
      // 记录当前正在上传的uid
      currentFileUid: null,
      percent: 0,
      showPercent: false
    }
  },
  computed: {
    // 判断是否要上传图片
    fileComputed () {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 点击预览事件
    preview (file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove (file, fileList) {
      // file是点击删除的文件
      // fileList是删除过后的文件
      // 将原来的文件给排除掉了 剩下的就是最新的数组了
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      // this.fileList=fileList
    },
    changeFile (file, fileList) {
      // file是当前的文件 fileList是当前最新的数组
      this.fileList = fileList.map(item => item)
    },
    beforeUpload (file) {
      // 检查文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      // 已经确定当前上传的就是当前的这个file了
      this.currentFileUid = file.uid
      this.showPercent = true
      // 当校验通过之后切记一定要return true 放行，允许上传
      return true
    },
    // 进行上传操作
    upload (params) {
      //   console.log(params.file)
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          Bucket: 'shuiruohanyu-106-1302806742', // 存储桶
          Region: 'ap-beijing', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          // 进度条
          onProgress: params => {
            this.percent = params.percent * 100
          }
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        }, (err, data) => {
          // data返回数据之后 应该如何处理
          console.log(err || data)
          // data中有一个statusCode === 200 的时候说明上传成功
          if (!err && data.statusCode === 200) {
            //   此时说明文件上传成功  要获取成功的返回地址
            // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
            // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
            // 需要知道当前上传成功的是哪一张图片
            this.fileList = this.fileList.map(item => {
              // 去找谁的uid等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                return { url: 'http://' + data.Location, upload: true }
                // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
              }
              return item
            })
            // 关闭进度条
            // 重置百分比
            setTimeout(() => {
              this.showPercent = false // 隐藏进度条
              this.percent = 0 // 进度归0
            }, 1000)
            // 将上传成功的地址 回写到了fileList中 fileList变化  =》 upload组件 就会根据fileList的变化而去渲染视图
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
