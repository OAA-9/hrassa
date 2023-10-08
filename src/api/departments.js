import request from '@/utils/request'

/* 获取组织架构的数据 */
export const getDepartments = () => {
  return request({
    url: '/company/department',
    method: 'POST'
  })
}

/* 删除组织架构的部门 */
export const delDepartments = id => {
  return request({
    url: `/company/department/${id}`,
    method: ' DELETE'
  })
}
