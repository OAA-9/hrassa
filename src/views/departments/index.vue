<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容-头部 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <tree-tools
          :tree-node="company"
          :is-root="true"
          @addDepts="addDepts"
        />
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
        <el-tree
          :data="departs"
          :props="defaultProps"
          default-expand-all
        >
          <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
          <!-- slot-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <tree-tools
            slot-scope="{ data }"
            :tree-node="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <!-- 放置弹出层组件 -->
    <add-dept
      ref="addDept"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @addDepts="getDepartments"
    />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import AddDept from './components/add-dept' // 引入新增部门组件

export default {
  components: {
    TreeTools,
    AddDept
  },
  data () {
    return {
      company: {}, // 就是头部的数据结构
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      showDialog: false,
      node: null
    }
  },
  created () {
    this.getDepartments() // 调用自身的方法
  },
  methods: {
    async getDepartments () {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(result.depts, '')
      console.log(result)
    },
    addDepts (node) {
      // 显示弹出层
      this.showDialog = true
      // 将要点击的部门记录下来
      this.node = node
    },
    editDepts (node) {
      // 显示弹出层
      this.showDialog = true
      this.node = node
      this.$refs.addDepts.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
