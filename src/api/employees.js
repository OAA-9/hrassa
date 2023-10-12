import request from '@/utils/request'

/**
 *  获取员工的简单列表
 * **/
export const getEmployeeSimple = () => {
  return request({
    url: '/sys/user/simple',
    method: 'GET'
  })
}

/**
 *  获取员工的综合列表
 * **/
export const getEmployeeList = params => {
  return request({
    url: '/sys/user',
    method: 'GET',
    params
  })
}

/**
 *  删除员工的接口
 * **/
export const delEmployee = id => {
  return request({
    url: `/sys/user/${id}`,
    method: 'DELETE'
  })
}

/**
 *  删除员工的接口
 * **/
export const addEmployee = data => {
  return request({
    url: '/sys/user',
    method: 'POST',
    data
  })
}

/** *
 *  封装一个导入员工的接口
 *
 * ***/
export const importEmployee = data => {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}
