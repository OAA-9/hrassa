<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- 左侧显示总记录 -->
        <span slot="before">共{{ page.total }}条记录</span>
        <!-- 右侧显示按钮 excel导入 excel导出 新增员工 -->
        <template #after>
          <el-button
            size="small"
            type="success"
            @click="$router.push('/import')"
          >excel导入</el-button>
          <el-button
            size="small"
            type="danger"
          >excel导出</el-button>
          <el-button
            size="small"
            type="primary"
            @click="showDialog=true"
          >新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格组件 -->
      <el-card>
        <el-table
          v-loading="loading"
          :data="list"
          border
        >
          <el-table-column
            type="index"
            label="序号"
            sortable=""
          />
          <el-table-column
            prop="username"
            label="姓名"
            sortable=""
          />
          <el-table-column
            prop="workNumber"
            label="工号"
            sortable=""
          />
          <el-table-column
            :formatter="formatEmployment"
            prop="formOfEmployment"
            label="聘用形式"
            sortable=""
          />
          <el-table-column
            prop="departmentName"
            label="部门"
            sortable=""
          />
          <el-table-column
            label="入职时间"
            sortable
            prop="timeOfEntry"
          >
            <template v-slot="{ row }">
              {{
                row.timeOfEntry | formatDate
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="账户状态"
            align="center"
            sortable=""
            prop="enableState"
          >
            <template v-slot="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            sortable=""
            fixed="right"
            width="280"
          >
            <template v-slot="{row}">
              <el-button
                type="text"
                size="small"
              >查看</el-button>
              <el-button
                type="text"
                size="small"
              >转正</el-button>
              <el-button
                type="text"
                size="small"
              >调岗</el-button>
              <el-button
                type="text"
                size="small"
              >离职</el-button>
              <el-button
                type="text"
                size="small"
              >角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="delEmployee(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            :current-page="page.page"
            :page-size="page.size"
            :total="page.total"
            layout="prev, pager, next"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 放置组件弹出层 -->
    <add-employee :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee'

export default {
  components: {
    AddEmployee
  },
  data () {
    return {
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      },
      showdialog: false
    }
  },
  created () {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList () {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage (newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment (row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === +cellValue)
      return obj ? obj.value : '未知'
    },
    async delEmployee (id) {
      try {
        await this.$confirm('确定删除员工')
        await delEmployee('id')
        this.$message.success('删除员工成功')
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

