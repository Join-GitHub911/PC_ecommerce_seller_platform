import request from '@/utils/request'

// 模拟角色数据
const mockRoles = [
  {
    id: 1,
    name: '管理员',
    level: 1,
    description: '系统管理员，拥有所有权限',
    createTime: '2023-01-01 00:00:00',
    menus: []
  },
  {
    id: 2,
    name: '普通用户',
    level: 2,
    description: '普通用户，只有基本权限',
    createTime: '2023-01-02 00:00:00',
    menus: []
  },
  {
    id: 3,
    name: '商品管理员',
    level: 3,
    description: '负责商品管理',
    createTime: '2023-01-03 00:00:00',
    menus: []
  }
]

// 获取所有的Role
export function getAll() {
  // 模拟获取所有角色
  return new Promise(resolve => {
    resolve({
      status: 0,
      data: mockRoles
    })
  })

  /* 原始代码
  return request({
    url: 'admin/roles',
    method: 'get'
  })
  */
}

// 获取用户级别
export function getLevel() {
  return new Promise(resolve => {
    resolve({
      status: 0,
      data: { level: 1 } // 模拟最高权限
    })
  })
}

export function add(data) {
  // 模拟添加角色
  return new Promise(resolve => {
    const newRole = {
      id: mockRoles.length + 1,
      ...data,
      createTime: new Date().toISOString().replace('T', ' ').substr(0, 19)
    }
    mockRoles.push(newRole)
    resolve({
      status: 0,
      data: newRole
    })
  })

  /* 原始代码
  return request({
    url: 'admin/roles',
    method: 'post',
    data
  })
  */
}

export function get(id) {
  // 模拟获取角色详情
  return new Promise(resolve => {
    const role = mockRoles.find(role => role.id === id) || {}
    resolve({
      status: 0,
      data: role
    })
  })

  /* 原始代码
  return request({
    url: 'admin/roles/' + id,
    method: 'get'
  })
  */
}

export function del(ids) {
  // 模拟删除角色
  return new Promise(resolve => {
    for (let i = 0; i < mockRoles.length; i++) {
      if (ids.includes(mockRoles[i].id)) {
        mockRoles.splice(i, 1)
        i--
      }
    }
    resolve({
      status: 0
    })
  })

  /* 原始代码
  return request({
    url: 'admin/roles',
    method: 'delete',
    data: ids
  })
  */
}

export function edit(data) {
  // 模拟编辑角色
  return new Promise(resolve => {
    const index = mockRoles.findIndex(role => role.id === data.id)
    if (index !== -1) {
      mockRoles[index] = { ...mockRoles[index], ...data }
    }
    resolve({
      status: 0
    })
  })

  /* 原始代码
  return request({
    url: 'admin/roles',
    method: 'put',
    data
  })
  */
}

export function editMenu(data) {
  // 模拟编辑角色菜单
  return new Promise(resolve => {
    const role = mockRoles.find(role => role.id === data.id)
    if (role) {
      role.menus = data.menus
    }
    resolve({
      status: 0
    })
  })

  /* 原始代码
  return request({
    url: 'admin/roles/menu',
    method: 'put',
    data
  })
  */
}

export default { add, edit, del, get, editMenu, getLevel }
