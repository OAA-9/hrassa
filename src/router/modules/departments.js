import Layout from '@/layout'

export default {
  path: '/departments', // 路径
  name: 'departments', // 给路由规则加一个name
  component: Layout, // 组件
  // 配置二级路的路由表
  children: [{
    path: '', // 这里当二级路由的path什么都不写的时候 表示该路由为当前路由的默认子路由
    component: () => import('@/views/departments'),
    name: 'departments',
    meta: {
      title: '组织架构',
      icon: 'tree'
    }
  }]
}
