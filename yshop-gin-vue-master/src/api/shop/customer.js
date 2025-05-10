import request from '@/utils/request'

// 模拟客户数据
const mockCustomers = [
  {
    id: 1,
    name: '张三',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    level: 0,
    levelText: '普通会员',
    levelType: '',
    orderCount: 5,
    totalSpent: '12500.00',
    lastOrderTime: '2024-05-06 15:30:22',
    createTime: '2023-10-15 10:20:30',
    address: '北京市朝阳区建国路88号'
  },
  {
    id: 2,
    name: '李四',
    phone: '13900139002',
    email: 'lisi@example.com',
    level: 1,
    levelText: '银卡会员',
    levelType: 'info',
    orderCount: 12,
    totalSpent: '38900.00',
    lastOrderTime: '2024-05-07 09:15:40',
    createTime: '2023-08-20 14:30:45',
    address: '上海市浦东新区陆家嘴金融中心'
  },
  {
    id: 3,
    name: '王五',
    phone: '13700137003',
    email: 'wangwu@example.com',
    level: 2,
    levelText: '金卡会员',
    levelType: 'warning',
    orderCount: 20,
    totalSpent: '65800.00',
    lastOrderTime: '2024-05-07 11:45:18',
    createTime: '2023-05-10 08:45:15',
    address: '广州市天河区天河路385号'
  },
  {
    id: 4,
    name: '赵六',
    phone: '13600136004',
    email: 'zhaoliu@example.com',
    level: 3,
    levelText: '钻石会员',
    levelType: 'success',
    orderCount: 35,
    totalSpent: '128500.00',
    lastOrderTime: '2024-05-07 14:20:36',
    createTime: '2023-03-05 16:10:25',
    address: '深圳市南山区科技园'
  }
]

// 模拟订单数据
const mockOrders = [
  {
    id: 1,
    orderNo: 'YS202405070001',
    createTime: '2024-05-07 10:20:30',
    payPrice: '9999.00',
    statusStr: '未发货',
    customerId: 1
  },
  {
    id: 2,
    orderNo: 'YS202405060002',
    createTime: '2024-05-06 15:30:22',
    payPrice: '2500.00',
    statusStr: '已完成',
    customerId: 1
  },
  {
    id: 3,
    orderNo: 'YS202405070002',
    createTime: '2024-05-07 11:30:45',
    payPrice: '19999.00',
    statusStr: '待收货',
    customerId: 2
  },
  {
    id: 4,
    orderNo: 'YS202405070003',
    createTime: '2024-05-07 15:10:25',
    payPrice: '7999.00',
    statusStr: '未支付',
    customerId: 3
  },
  {
    id: 5,
    orderNo: 'YS202405070004',
    createTime: '2024-05-07 14:20:36',
    payPrice: '15800.00',
    statusStr: '待收货',
    customerId: 4
  }
]

// 获取客户列表
export function getCustomers(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 过滤等级
      let filteredCustomers = [...mockCustomers]
      if (params.level) {
        filteredCustomers = filteredCustomers.filter(customer => 
          customer.level.toString() === params.level
        )
      }
      
      // 搜索
      if (params.value) {
        filteredCustomers = filteredCustomers.filter(customer => 
          customer.name.includes(params.value) || 
          customer.phone.includes(params.value)
        )
      }
      
      // 分页
      const start = params.page * params.size
      const end = start + params.size
      const content = filteredCustomers.slice(start, end)
      
      // 统计数据
      const totalSpent = filteredCustomers.reduce((sum, customer) => 
        sum + parseFloat(customer.totalSpent), 0
      ).toFixed(2)
      
      const avgOrder = (totalSpent / filteredCustomers.length).toFixed(2)
      
      resolve({
        code: 0,
        message: 'success',
        data: {
          content: content,
          totalElements: filteredCustomers.length,
          totalCustomers: mockCustomers.length,
          newCustomers: 2, // 本月新增
          totalSpent: totalSpent,
          avgOrder: avgOrder
        }
      })
    }, 500)
  })
}

// 获取客户详情
export function getCustomerDetail(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const customer = mockCustomers.find(item => item.id === id)
      // 获取该客户的订单
      const orders = mockOrders.filter(order => order.customerId === id)
      
      resolve({
        code: 0,
        message: 'success',
        data: {
          ...customer,
          orders: orders
        }
      })
    }, 300)
  })
}

// 更新客户信息
export function updateCustomer(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 在实际应用中这里会发送请求更新客户信息
      // 这里仅模拟成功响应
      const index = mockCustomers.findIndex(item => item.id === data.id)
      if (index !== -1) {
        // 更新客户信息
        mockCustomers[index].name = data.name
        mockCustomers[index].phone = data.phone
        mockCustomers[index].email = data.email
        mockCustomers[index].address = data.address
        
        // 更新等级相关信息
        mockCustomers[index].level = parseInt(data.level)
        
        // 根据等级设置对应的文本和类型
        switch(parseInt(data.level)) {
          case 0:
            mockCustomers[index].levelText = '普通会员'
            mockCustomers[index].levelType = ''
            break
          case 1:
            mockCustomers[index].levelText = '银卡会员'
            mockCustomers[index].levelType = 'info'
            break
          case 2:
            mockCustomers[index].levelText = '金卡会员'
            mockCustomers[index].levelType = 'warning'
            break
          case 3:
            mockCustomers[index].levelText = '钻石会员'
            mockCustomers[index].levelType = 'success'
            break
        }
      }
      
      resolve({
        code: 0,
        message: 'success'
      })
    }, 300)
  })
}

// 删除客户
export function deleteCustomer(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockCustomers.findIndex(item => item.id === id)
      if (index !== -1) {
        mockCustomers.splice(index, 1)
      }
      
      resolve({
        code: 0,
        message: 'success'
      })
    }, 300)
  })
} 