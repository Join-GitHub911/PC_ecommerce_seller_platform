import request from '@/utils/request'

// 模拟订单数据
const mockOrders = [
  {
    id: 1,
    orderNo: 'YS202405070001',
    realName: '张三',
    userPhone: '13800138001',
    productName: 'Apple iPhone 15 Pro Max 256GB 深蓝色',
    payPrice: '9999.00',
    status: 1,
    statusStr: '未发货',
    createTime: '2024-05-07 10:20:30',
    payTime: '2024-05-07 10:25:40'
  },
  {
    id: 2,
    orderNo: 'YS202405070002',
    realName: '李四',
    userPhone: '13900139002',
    productName: 'MacBook Pro 14英寸 M3芯片 16GB 1TB',
    payPrice: '19999.00',
    status: 2,
    statusStr: '待收货',
    createTime: '2024-05-07 11:30:45',
    payTime: '2024-05-07 11:35:20'
  },
  {
    id: 3,
    orderNo: 'YS202405070003',
    realName: '王五',
    userPhone: '13700137003',
    productName: 'iPad Pro 12.9英寸 M2芯片 256GB 深空灰色',
    payPrice: '7999.00',
    status: 0,
    statusStr: '未支付',
    createTime: '2024-05-07 15:10:25',
    payTime: null
  }
]

// 获取订单列表
export function getOrders(params) {
  // 模拟API响应
  return new Promise((resolve) => {
    setTimeout(() => {
      // 过滤状态
      let filteredOrders = [...mockOrders]
      if (params.status) {
        filteredOrders = filteredOrders.filter(order => order.status.toString() === params.status)
      }
      
      // 搜索
      if (params.value) {
        filteredOrders = filteredOrders.filter(order => 
          order.orderNo.includes(params.value) || 
          order.realName.includes(params.value)
        )
      }
      
      // 分页
      const start = params.page * params.size
      const end = start + params.size
      const content = filteredOrders.slice(start, end)
      
      resolve({
        code: 0,
        message: 'success',
        data: {
          content: content,
          totalElements: filteredOrders.length
        }
      })
    }, 500)
  })
}

// 获取订单详情
export function getOrderDetail(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const order = mockOrders.find(item => item.id === id)
      
      resolve({
        code: 0,
        message: 'success',
        data: order
      })
    }, 300)
  })
}

// 发货
export function shipOrder(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 在实际应用中这里会发送请求更新订单状态
      // 这里仅模拟成功响应
      const index = mockOrders.findIndex(item => item.id === data.id)
      if (index !== -1) {
        mockOrders[index].status = 2
        mockOrders[index].statusStr = '待收货'
      }
      
      resolve({
        code: 0,
        message: 'success'
      })
    }, 300)
  })
}

// 确认收货
export function confirmOrder(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockOrders.findIndex(item => item.id === id)
      if (index !== -1) {
        mockOrders[index].status = 3
        mockOrders[index].statusStr = '待评价'
      }
      
      resolve({
        code: 0,
        message: 'success'
      })
    }, 300)
  })
}

// 取消订单
export function cancelOrder(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockOrders.findIndex(item => item.id === id)
      if (index !== -1) {
        mockOrders[index].status = -1
        mockOrders[index].statusStr = '已取消'
      }
      
      resolve({
        code: 0,
        message: 'success'
      })
    }, 300)
  })
}

export default { getOrders, getOrderDetail, shipOrder, confirmOrder, cancelOrder } 