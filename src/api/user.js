import request from '@/utils/request'

// export function login (data) {
//   return request({
//     url: '/sys/login',
//     method: 'post',
//     data
//   })
// }

export const login = data => {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

export const getUserInfo = () => {
  return request({
    url: '/sys/profile',
    method: 'POST'

  })
}

export const getUserDetailById = id => {
  return request({
    url: `/sys/user/{id}`,
    method: 'GET'
  })
}
export function logout () {

}
