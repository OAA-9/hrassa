<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 右边的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button
            type="primary"
            size="samll"
            @click="addPermission(1,'0')"
          >
            添加权限
          </el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table
        border
        :data="list"
        row-key="id"
      >
        <el-table-column
          prop="name"
          align="center"
          label="名称"
        />
        <el-table-column
          prop="code"
          align="center"
          label="标识"
        />
        <el-table-column
          prop="description"
          align="center"
          label="描述"
        />
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="{ row }">
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="addPermission(2, row.id)"
            >添加</el-button>
            <el-button
              type="text"
              @click="editPermission(row.id)"
            >编辑</el-button>
            <el-button
              type="text"
              @click="delPermission(row.id)"
            > 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹出层 -->
    <el-dialog
      :title="showText"
      :visible="showDialog"
      @close="btnCancel"
    >
      <!-- 表单 -->
      <el-form
        ref="permForm"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item
          label="权限名称"
          prop="name"
        >
          <el-input
            v-model="formData.name"
            style="width:90%"
          />
        </el-form-item>
        <el-form-item
          label="权限标识"
          prop="code"
        >
          <el-input
            v-model="formData.code"
            style="width:90%"
          />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input
            v-model="formData.description"
            style="width:90%"
          />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row
        slot="footer"
        type="flex"
        justify="center"
      >
        <el-col :span="6">
          <el-button
            size="small"
            type="primary"
            @click="btnOK"
          >确定</el-button>
          <el-button
            size="small"
            @click="btnCancel"
          >取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, delPermission, addPermission, updatePermission, getPermissionDetail } from '@/api/permission'
import { tranListToTreeData } from '@/utils'

export default {
  name: 'Permission',
  data () {
    return {
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false
    }
  },
  computed: {
    showText () {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created () {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList () {
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
    async addPermission (type, pid) {
      // 访问权限type=1 按钮操作type=2
      // pid表示当前数据的父节点的标识
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    async editPermission (id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    },
    async delPermission (id) {
      try {
        await this.$confirm('确定要删除该数据吗')
        await delPermission(id)
        this.getPermissionList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    btnOk () {
      this.$refs.permForm.validate().then(() => {
        // 校验成功
        if (this.formData.id) {
          // 编辑状态
          return updatePermission(this.formData)
        }
        return addPermission(this.formData)
      }).then(() => {
        // 添加成功
        this.$message.success('操作成功')
        this.getPermissionList()
        this.showDialog = false
      })
    },
    btnCancel () {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      // 移除校验
      this.$refs.permForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style>
</style>
