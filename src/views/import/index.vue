<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'

export default {
  name: 'ImportIndex',
  // 组件方法
  methods: {
    // 在methods中修改success函数
    async success ({ header, results }) {
      // 如果是导入员工
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // const arr = []
      // results.forEach(item => {
      //   const userInfo = {}
      //   Object.keys(item).forEach(key => {
      //     userInfo[userRelations[key]] = item[key]
      //   })
      //   arr.push(userInfo)
      // })
      // await importEmployee(arr) // 调用导入接口
      // map 函数 通过指定函数处理数组的每个元素，并返回处理后的数组。
      // map() 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值
      var newArr = results.map(item => {
        var userInfo = {}
        Object.keys(item).forEach(key => {
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
          } else {
            userInfo[userRelations[key]] = item[key]
          }
        })
        return userInfo
      })
      await importEmployee(newArr) // 调用导入接口
      this.$message.success('导入excel成功')
      this.$router.back() // 回到上一个页面
    },
    // 转化excel的日期格式
    formatDate (numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>
