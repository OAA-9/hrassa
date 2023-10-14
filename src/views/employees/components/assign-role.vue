<template>
  <el-dialog
    title="分配角色"
    :visible="showRoleDialog"
    @close="btnCancel"
  >
    <!--多选框组  -->
    <!-- 分配角色 -->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox
        v-for="item in list"
        :key="item.id"
        :label="item.id"
      >
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <!-- 定义footer插槽 -->
    <el-row
      slot="footer"
      type="flex"
      justify="center"
    >
      <el-col :span="6">
        <el-button
          type="primary"
          size="small"
          @click="btnOk"
        >确定</el-button>
        <el-button
          size="samll"
          @click="btnCancel"
        >取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  name: 'AssignRoleVue',
  components: {},
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      list: [], // 所有角色列表
      roleIds: [] // 当前用户所拥有的角色id
    }
  },
  created () {
    // 获取所有的角色
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { rows } = await getRoleList({
        page: 1,
        pagesize: 20
      })
      this.list = rows
    },
    // props传值是异步的，所以不能使用this.userId
    async getUserDetailById (id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    async btnOk () {
      await assignRoles({ id: this.id, roleIds: this.roleIds })
      this.$emit('update:showRoleDialog', false)
    },
    btnCancel () {
      this.roleIds = []
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style scoped lang="less">
</style>
