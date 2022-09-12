import request from '@/service/request-raw'

export function login(data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}
export function getInfo(token) {
  return request({
    url: '/api/user/verifyToken',
    method: 'get',
    params: { token }
  })
}

export function logout(data) {
  return request({
    url: '/api/user/logout',
    method: 'post',
    data
  })
}
