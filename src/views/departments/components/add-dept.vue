<template>
  <!-- 新增部门的弹层 -->
  <el-dialog
    :title="showTitle"
    :visible="showDialog"
    @close="btnCancel"
  >
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form
      ref="deptForm"
      label-width="120px"
      :model="formData"
      :rules="rules"
    >
      <el-form-item
        label="部门名称"
        prop="name"
      >
        <el-input
          v-model="formData.name"
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item
        label="部门编码"
        prop="code"
      >
        <el-input
          v-model="formData.code"
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item
        label="部门负责人"
        prop="manager"
      >
        <!-- 此时在控制台会有一个报错，是因为el-select组件需要绑定v-model，不影响，后面做表单校验的时候会添加 -->
        <el-select
          v-model="formData.manager"
          style="width:80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          /></el-select>
      </el-form-item>
      <el-form-item
        label="部门介绍"
        prop="introduce"
      >
        <el-input
          v-model="formData.introduce"
          style="width:80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row
      slot="footer"
      type="flex"
      justify="center"
    >
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button
          type="primary"
          size="small"
          @click="btnOk"
        >确定</el-button>
        <el-button
          size="small"
          @click="btnCancel"
        >取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data () {
    // 现在定义一个函数 这个函数的目的是 去找 同级部门下 是否有重复的部门名称
    const checkNameRepeat = async (rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      //  检查重复规则 需要支持两种 新增模式 / 编辑模式
      // depts是所有的部门数据
      // 如何去找技术部所有的子节点
      let isRepeat = false
      if (this.formData.id) {
        // 有id就是编辑模式
        // 编辑 张三 => 校验规则 除了我之外 同级部门下 不能有叫张三的
        isRepeat = depts
          .filter(
            (item) => item.id !== this.treeNode.id && item.pid === this.treeNode.pid
          )
          .some((item) => item.name === value)
      } else {
        // 没id就是新增模式
        isRepeat = depts
          .filter((item) => item.pid === this.treeNode.id)
          .some((item) => item.name === value)
      }

      isRepeat
        ? callback(new Error(`同级部门下已经有${value}的部门了`))
        : callback()
    }
    // 检查编码重复
    const checkCodeRepeat = async (rule, value, callback) => {
      // 先要获取最新的组织架构数据
      //  检查重复规则 需要支持两种 新增模式 / 编辑模式
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式  因为编辑模式下 不能算自己
        isRepeat = depts.some(
          (item) => item.id !== this.treeNode.id && item.code === value && value
        )
      } else {
        // 新增模式
        isRepeat = depts.some((item) => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有code
      }

      isRepeat
        ? callback(new Error(`组织架构中已经有部门使用${value}编码`))
        : callback()
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      // 定义校验规则
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }, { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' }, {
          trigger: 'blur',
          validator: checkNameRepeat // 自定义函数的形式校验
        }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' }, { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' }, {
          trigger: 'blur',
          validator: checkCodeRepeat
        }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' }, { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      },
      peoples: []
    }
  },
  computed: {
    showTitle () {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
    async getEmployeeSimple () {
      this.peoples = await getEmployeeSimple()
    },
    // 获取详情方法
    async getDepartDetail (id) {
      this.formData = await getDepartDetail('id')
    },
    // 点击确定时触发
    btnOK () {
      this.$refs.deptForm.validate(async isOK => {
        // 如果手动校验通过，那么isOK是布尔值的true
        if (isOK) {
          if (this.formData.id) {
            // 编辑
            await updateDepartments(this.formData)
          } else {
            // 新增
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          this.$emit('addDepts')
          // 还可以是用v-model
          // v-model采用input方法和value传值
          // 可以用model{}来修改值
          // v-model="showDialog"
          // this.$emit('input',false)
          this.$emit('update:showDialog', false)
          // 关闭dialog的时候会触发el-dialog的close事件
        }
      })
    },
    btnCancel () {
      // 重置数据  因为resetFields 只能重置 表单上的数据 非表单上的 比如 编辑中id 不能重置
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 关闭弹出层
      this.$emit('update:showDialog', false)
      // 消除校验方法
      this.$refs.deptForm.resetFileds()
    }
  }
}
</script>
