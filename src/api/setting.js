import request from '@/utils/request'

/* 获取角色列表 */
export const getRoleList = params => {
  return request({
    url: '/sys/role',
    method: 'GET',
    params
  })
}

/* 获取公司信息 */
export const getCompanyInfo = companyId => {
  return request({
    url: `/company/${companyId}`,
    method: 'GET'
  })
}

/* 删除角色 */
export const deleteRole = id => {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}

/* 获取角色信息 */
export const updateRole = data => {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'PUT'
  })
}

/* 获取企业信息 */
export const getRoleDetail = id => {
  return request({
    url: `/sys/role/${id}`,
    method: 'GET'
  })
}

/* 新增角色 */
export const addRole = data => {
  return request({
    url: '/sys/role',
    method: 'POST',
    data
  })
}
