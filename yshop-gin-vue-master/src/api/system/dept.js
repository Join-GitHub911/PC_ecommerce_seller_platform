import request from '@/utils/request'

// 模拟部门数据
const mockDepts = [
  {
    id: 1,
    name: '总部',
    enabled: true,
    pid: 0,
    subCount: 2,
    createTime: '2023-01-01 00:00:00',
    children: [
      {
        id: 2,
        name: '研发部',
        enabled: true,
        pid: 1,
        subCount: 0,
        createTime: '2023-01-01 00:00:00'
      },
      {
        id: 3,
        name: '市场部',
        enabled: true,
        pid: 1,
        subCount: 0,
        createTime: '2023-01-01 00:00:00'
      }
    ]
  }
]

export function getDepts(params) {
  // 模拟获取部门数据
  return new Promise(resolve => {
    resolve({
      status: 0,
      data: mockDepts
    })
  })

  /* 原始代码
  return request({
    url: 'admin/dept',
    method: 'get',
    params
  })
  */
}

export function add(data) {
  // 模拟添加部门
  return new Promise(resolve => {
    const newDept = {
      id: Date.now(),
      ...data,
      createTime: new Date().toISOString().replace('T', ' ').substr(0, 19),
      subCount: 0,
      children: []
    }
    
    if (data.pid === 0) {
      // 添加到根部门
      mockDepts.push(newDept)
    } else {
      // 查找父部门并添加子部门
      const findAndAdd = (depts) => {
        for (let dept of depts) {
          if (dept.id === data.pid) {
            if (!dept.children) dept.children = []
            dept.children.push(newDept)
            dept.subCount = (dept.children || []).length
            return true
          } else if (dept.children) {
            if (findAndAdd(dept.children)) return true
          }
        }
        return false
      }
      findAndAdd(mockDepts)
    }
    
    resolve({
      status: 0
    })
  })

  /* 原始代码
  return request({
    url: 'admin/dept',
    method: 'post',
    data
  })
  */
}

export function del(ids) {
  // 模拟删除部门
  return new Promise(resolve => {
    const deleteById = (depts, id) => {
      for (let i = 0; i < depts.length; i++) {
        if (depts[i].id === id) {
          depts.splice(i, 1)
          return true
        } else if (depts[i].children) {
          if (deleteById(depts[i].children, id)) {
            depts[i].subCount = (depts[i].children || []).length
            return true
          }
        }
      }
      return false
    }
    
    for (let id of ids) {
      deleteById(mockDepts, id)
    }
    
    resolve({
      status: 0
    })
  })

  /* 原始代码
  return request({
    url: 'admin/dept',
    method: 'delete',
    data: ids
  })
  */
}

export function edit(data) {
  // 模拟编辑部门
  return new Promise(resolve => {
    const updateDept = (depts, updatedDept) => {
      for (let i = 0; i < depts.length; i++) {
        if (depts[i].id === updatedDept.id) {
          depts[i] = { ...depts[i], ...updatedDept, children: depts[i].children }
          return true
        } else if (depts[i].children) {
          if (updateDept(depts[i].children, updatedDept)) {
            return true
          }
        }
      }
      return false
    }
    
    updateDept(mockDepts, data)
    
    resolve({
      status: 0
    })
  })

  /* 原始代码
  return request({
    url: 'admin/dept',
    method: 'put',
    data
  })
  */
}

export function getDeptSuperior(data) {
  // 模拟获取上级部门
  return new Promise(resolve => {
    resolve({
      status: 0,
      data: mockDepts
    })
  })

  /* 原始代码
  return request({
    url: 'admin/dept',
    method: 'get',
    data
  })
  */
}

export default { add, edit, del, getDepts, getDeptSuperior }
