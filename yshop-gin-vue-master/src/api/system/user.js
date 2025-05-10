import request from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'

// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    nickName: '管理员',
    sex: '男',
    phone: '13888888888',
    email: 'admin@youhong.com',
    dept: { id: 1, name: '总部' },
    job: { id: 1, name: '管理员' },
    enabled: 1,
    createTime: '2023-01-01 00:00:00',
    roles: [{ id: 1, name: '管理员' }],
    roleIds: [1]
  },
  {
    id: 2,
    username: 'test',
    nickName: '测试账号',
    sex: '女',
    phone: '13666666666',
    email: 'test@youhong.com',
    dept: { id: 2, name: '研发部' },
    job: { id: 2, name: '开发人员' },
    enabled: 1,
    createTime: '2023-01-02 00:00:00',
    roles: [{ id: 2, name: '普通用户' }],
    roleIds: [2]
  }
]

// 模拟管理员数据
const mockAdminUser = {
  user: {
    avatar: 'https://i.loli.net/2019/04/04/5ca5b971e1548.jpeg',
    createTime: 1534986716000,
    email: 'admin@youhong.com',
    enabled: true,
    password: 'e10adc3949ba59abbe56e057f20f883e',
    createBy: 'admin',
    updateBy: 'admin',
    updateTime: new Date(),
    username: 'admin',
    id: 1,
    roles: ['admin']
  },
  roles: ['admin'],
  dataScopes: ['1', '2', '3', '4', '5', '6', '7']
}

// 模拟测试用户数据
const mockTestUser = {
  user: {
    avatar: 'https://i.loli.net/2019/04/04/5ca5b971e1548.jpeg',
    createTime: 1534986716000,
    email: 'test@youhong.com',
    enabled: true,
    password: 'e10adc3949ba59abbe56e057f20f883e',
    createBy: 'admin',
    updateBy: 'admin',
    updateTime: new Date(),
    username: 'test',
    id: 2,
    roles: ['user']
  },
  roles: ['user'],
  dataScopes: ['1', '2']
}

// 模拟分页查询
export function getUsers(params) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        status: 0,
        data: {
          content: mockUsers,
          totalElements: mockUsers.length
        }
      })
    }, 100)
  })
}

export function add(data) {
  // 模拟添加用户
  return new Promise(resolve => {
    const newUser = {
      id: mockUsers.length + 1,
      ...data,
      createTime: new Date().toISOString().replace('T', ' ').substr(0, 19)
    }
    mockUsers.push(newUser)
    resolve({
      status: 0,
      data: newUser
    })
  })

  // 原始请求，当后端可用时恢复
  /*
  return request({
    url: 'admin/user',
    method: 'post',
    data
  })
  */
}

export function del(ids) {
  // 模拟删除用户
  return new Promise(resolve => {
    for (let i = 0; i < mockUsers.length; i++) {
      if (ids.includes(mockUsers[i].id)) {
        mockUsers.splice(i, 1)
        i--
      }
    }
    resolve({
      status: 0
    })
  })

  // 原始请求，当后端可用时恢复
  /*
  return request({
    url: 'admin/user',
    method: 'delete',
    data: ids
  })
  */
}

export function edit(data) {
  // 模拟编辑用户
  return new Promise(resolve => {
    const index = mockUsers.findIndex(user => user.id === data.id)
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...data }
    }
    resolve({
      status: 0
    })
  })

  // 原始请求，当后端可用时恢复
  /*
  return request({
    url: 'admin/user',
    method: 'put',
    data
  })
  */
}

export function editUser(data) {
  return request({
    url: 'admin/user/center',
    method: 'put',
    data
  })
}

export function updatePass(user) {
  const data = {
    oldPass: user.oldPass,
    newPass: user.newPass
  }
  return request({
    url: 'admin/user/updatePass/',
    method: 'post',
    data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/admin/user/updateAvatar',
    method: 'post',
    data: data
  })
}

export default { add, edit, del, uploadAvatar, getUsers }

