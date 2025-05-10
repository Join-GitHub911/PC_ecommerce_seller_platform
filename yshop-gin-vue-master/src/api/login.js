import request from '@/utils/request'

export function login(username, password, code, uuid) {
  // 模拟成功登录
  if (username === 'admin' && password === '123456') {
    return new Promise(resolve => {
      resolve({
        status: 0,
        data: {
          token: 'mock-token-123456',
          user: {
            id: 1,
            username: 'admin',
            nickname: '管理员',
            avatar: 'https://i.loli.net/2019/04/04/5ca5b971e1548.jpeg',
            Permissions: ['*:*:*']
          }
        },
        msg: '登录成功'
      })
    })
  }
  
  return request({
    url: 'auth/login',
    method: 'post',
    data: {
      username,
      password,
      code: code || '1234',
      uuid
    }
  })
}

export function getInfo() {
  // 模拟用户信息
  return new Promise(resolve => {
    resolve({
      status: 0,
      data: {
        id: 1,
        username: 'admin',
        nickname: '管理员',
        avatar: 'https://i.loli.net/2019/04/04/5ca5b971e1548.jpeg',
        Permissions: ['*:*:*'],
        roles: ['admin']
      }
    })
  })
}

export function getCodeImg() {
  // 模拟验证码
  return new Promise(resolve => {
    resolve({
      status: 0,
      data: {
        id: 'mock-uuid-12345',
        base_64_blob: 'data:image/png;base64,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'
      }
    })
  })
}

export function logout() {
  return request({
    url: 'admin/auth/logout',
    method: 'delete'
  })
}
