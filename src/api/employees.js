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

/** *
 *
 * 保存员工的基本信息
 * **/
export const saveUserDetailById = data => {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'PUT',
    data
  })
}

/** *
 *  读取用户详情的基础信息
 * **/
export const getPersonalDetail = id => {
  return request({
    url: `/employees/${id}/personalInfo`,
    methods: 'GET'
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export const updatePersonal = data => {
  request({
    url: `/employees/${data.userId}/personalInfo`,
    methods: 'PUT',
    data

  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export const getJobDetail = id => {
  return request({
    url: `/employees/${id}/jobs`,
    methods: 'GET'
  })
}

/**
 * 保存岗位信息
 * ****/
export const updateJob = data => {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

/** *
 * 给用户分配角色
 * ***/
export const assignRoles = data => {
  request({
    url: '/sys/user/assignRoles',
    methods: 'PUT',
    data
  })
}
