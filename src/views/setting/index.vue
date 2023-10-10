<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog=true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table
              border=""
              :data="list"
            >
              <el-table-column
                type="index"
                header-align="left"
                align="center"
                prop="id"
                label="序号"
                width="120"
              />
              <el-table-column
                align="center"
                prop="name"
                label="角色名称"
                width="240"
              />
              <el-table-column
                align="center"
                prop="description"
                label="描述"
              />
              <el-table-column
                align="center"
                prop="companyId"
                label="操作"
              >
                <template slot-scope="{row}">
                  <el-button
                    size="small"
                    type="success"
                  >分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                  >编辑</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(row.id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 放置分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev,pager,next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form
              label-width="120px"
              style="margin-top:50px"
            >
              <el-form-item label="企业名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width:400px"
                />
                <el-form-item label="电话">
                  <el-input
                    v-model="formData.companyPhone"
                    disabled
                    style="width:400px"
                  />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input
                    v-model="formData.mailbox"
                    disabled
                    style="width:400px"
                  />
                </el-form-item>
                <el-form-item label="备注">
                  <el-input
                    v-model="formData.remarks"
                    type="textarea"
                    :rows="3"
                    disabled
                    style="width:400px"
                  />
                </el-form-item>
              </el-form-item></el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>
    <!-- 放置一个弹出层组件 -->
    <el-dialog
      title="编辑部门"
      :visible="showDialog"
      @close="btnCancel"
    >
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item
          label="角色名称"
          prop="name"
        >
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 放置一个footer的插槽 -->
      <el-row
        slot="footer"
        type="flex"
        justify="center"
      >
        <el-col :span="6">
          <el-button
            size="small"
            @click="btnCancel"
          >取消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="btnOK"
          >确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'

export default {
  // 组件名称
  name: 'Setting',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data () {
    return {
      list: [],
      page: {
        page: 1,
        pagesize: 10,
        // 记录总数
        total: 0
      },
      formData: {
        // 公司信息
      },
      showDialog: true,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  // 计算属性
  computed: {
    ...mapGetters(['companyId'])
  },

  // 侦听器
  watch: {},

  created () {
    this.getRoleList()
    this.getCompanyInfo()
  },

  mounted () { },
  // 组件方法
  methods: {
    async getRoleList () {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    async getCompanyInfo () {
      this.formData = await getCompanyInfo(this.companyId)
    },
    changePage (newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    async deleteRole (id) {
      //  提示
      try {
        await this.$confirm('确认删除该角色吗')
        // 只有点击了确定 才能进入到下方
        await deleteRole(id) // 调用删除接口
        this.getRoleList() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole (id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    async btnOK () {
      try {
        await this.$refs.roleForm.validate()
        // 只有通过表单校验才能执行下面的内容
        // roleForm这个对象有id就是编辑 没有id就是新增
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          // 新增业务
          await addRole(this.roleForm)
        }
        // 执行成功后重新拉去数据
        this.getRoleList()
        this.$message.success('操作成功')
        this.showDialog = false
        // 关闭弹出层会触发el-dailog的close事件
      } catch (error) {
        console.log('校验失败', error)
      }
    },
    btnCancel () {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFileds()
      this.showDialog = false
    }
  }
}
</script>

<style scoped lang="less">
</style>
