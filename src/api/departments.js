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

/* 新增组织架构的部门 */
export const addDepartments = data => {
  return request({
    url: '/company/department',
    method: ' POST',
    data
  })
}

/* 获取某一个部门的详情 */
export const getDepartDetail = id => {
  return request({
    url: `/company/department/${id}`,
    method: ' GET'
  })
}

/* 保存编辑数据 */
export const updateDepartments = data => {
  return request({
    url: `/company/department/${data.id}`,
    method: ' GET',
    data
  })
}
