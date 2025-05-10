import request from '@/utils/request'

// 模拟订单数据
const mockOrders = [
  {
    id: 1,
    orderId: 'YS20230101000001',
    uid: 1,
    realName: '张三',
    userPhone: '13888888888',
    userAddress: '北京市朝阳区三里屯街道10号',
    cartId: '1,2',
    totalNum: 2,
    totalPrice: 15998.00,
    totalPostage: 0.00,
    payPrice: 15998.00,
    payPostage: 0.00,
    deductionPrice: 0.00,
    couponId: 0,
    couponPrice: 0.00,
    paid: 1,
    payTime: '2023-01-01 10:30:25',
    payType: 'weixin',
    payTypeName: '微信支付',
    status: 1,
    statusName: '<b style="color:#0092DC;">已支付，待发货</b>',
    _status: 2,
    refundStatus: 0,
    refundReasonWapImg: '',
    refundReasonWapExplain: '',
    refundReasonTime: '',
    refundReasonWap: '',
    refundReason: '',
    refundPrice: 0.00,
    deliveryName: '',
    deliveryType: '',
    deliveryId: '',
    gainIntegral: 0,
    useIntegral: 0,
    backIntegral: 0,
    mark: '',
    remark: '',
    createTime: '2023-01-01 10:20:15',
    updateTime: '2023-01-01 10:30:25',
    userDTO: {
      id: 1,
      nickname: '用户_1',
      avatar: 'https://image.baidu.com/search/down?url=https://wx2.sinaimg.cn/orj360/001NlIXily1hfnr8khj6gj60u00u0q5k02.jpg'
    },
    cartInfo: [
      {
        id: 1,
        productId: 1,
        cartNum: 1,
        truePrice: 7999.00,
        productInfo: {
          id: 1,
          storeName: 'iPhone 13 Pro Max',
          image: 'https://img.alicdn.com/bao/uploaded/i1/2024216342/O1CN01iZGtGk1Vjf9vbUCOg_!!2024216342.jpg',
          price: 7999.00,
          otPrice: 8999.00,
          sales: 1000,
          stock: 500,
          isShow: 1,
          isHot: 1,
          storeCategoryName: 'Apple'
        }
      },
      {
        id: 2,
        productId: 2,
        cartNum: 1,
        truePrice: 7999.00,
        productInfo: {
          id: 2,
          storeName: '华为 Mate 40 Pro',
          image: 'https://img.alicdn.com/bao/uploaded/i1/2539005694/O1CN01joh7pR1Tq6lYPE4rK_!!2539005694.jpg',
          price: 6999.00,
          otPrice: 7599.00,
          sales: 800,
          stock: 300,
          isShow: 1,
          isHot: 1,
          storeCategoryName: 'Huawei'
        }
      }
    ],
    pinkName: ''
  },
  {
    id: 2,
    orderId: 'YS20230102000001',
    uid: 2,
    realName: '李四',
    userPhone: '13666666666',
    userAddress: '上海市浦东新区陆家嘴街道88号',
    cartId: '3',
    totalNum: 1,
    totalPrice: 4999.00,
    totalPostage: 0.00,
    payPrice: 4999.00,
    payPostage: 0.00,
    deductionPrice: 0.00,
    couponId: 0,
    couponPrice: 0.00,
    paid: 1,
    payTime: '2023-01-02 14:20:35',
    payType: 'alipay',
    payTypeName: '支付宝支付',
    status: 2,
    statusName: '<b style="color:#44b549;">待收货</b>',
    _status: 4,
    refundStatus: 0,
    refundReasonWapImg: '',
    refundReasonWapExplain: '',
    refundReasonTime: '',
    refundReasonWap: '',
    refundReason: '',
    refundPrice: 0.00,
    deliveryName: '顺丰快递',
    deliveryType: 'express',
    deliveryId: 'SF1234567890',
    gainIntegral: 0,
    useIntegral: 0,
    backIntegral: 0,
    mark: '',
    remark: '',
    createTime: '2023-01-02 14:10:15',
    updateTime: '2023-01-02 15:30:25',
    userDTO: {
      id: 2,
      nickname: '用户_2',
      avatar: 'https://image.baidu.com/search/down?url=https://wx4.sinaimg.cn/orj360/001NlIXily1hfnr8lhj6gj60u00u0q5k02.jpg'
    },
    cartInfo: [
      {
        id: 3,
        productId: 3,
        cartNum: 1,
        truePrice: 4999.00,
        productInfo: {
          id: 3,
          storeName: '小米 12 Pro',
          image: 'https://img.alicdn.com/bao/uploaded/i1/2549841410/O1CN01MHKdSw1OHyOghdxvG_!!0-item_pic.jpg',
          price: 4999.00,
          otPrice: 5599.00,
          sales: 1200,
          stock: 600,
          isShow: 1,
          isHot: 0,
          storeCategoryName: 'Xiaomi'
        }
      }
    ],
    pinkName: ''
  },
  {
    id: 3,
    orderId: 'YS20230103000001',
    uid: 3,
    realName: '王五',
    userPhone: '13777777777',
    userAddress: '广州市天河区天河路123号',
    cartId: '4',
    totalNum: 1,
    totalPrice: 3999.00,
    totalPostage: 0.00,
    payPrice: 3999.00,
    payPostage: 0.00,
    deductionPrice: 0.00,
    couponId: 0,
    couponPrice: 0.00,
    paid: 1,
    payTime: '2023-01-03 09:15:25',
    payType: 'weixin',
    payTypeName: '微信支付',
    status: 3,
    statusName: '<b style="color:#e93323;">待评价</b>',
    _status: 3,
    refundStatus: 0,
    refundReasonWapImg: '',
    refundReasonWapExplain: '',
    refundReasonTime: '',
    refundReasonWap: '',
    refundReason: '',
    refundPrice: 0.00,
    deliveryName: '中通快递',
    deliveryType: 'express',
    deliveryId: 'ZT9876543210',
    gainIntegral: 0,
    useIntegral: 0,
    backIntegral: 0,
    mark: '',
    remark: '',
    createTime: '2023-01-03 09:05:15',
    updateTime: '2023-01-03 10:30:25',
    userDTO: {
      id: 3,
      nickname: '用户_3',
      avatar: 'https://image.baidu.com/search/down?url=https://wx3.sinaimg.cn/orj360/001NlIXily1hfnr8mhj6gj60u00u0q5k02.jpg'
    },
    cartInfo: [
      {
        id: 4,
        productId: 4,
        cartNum: 1,
        truePrice: 3999.00,
        productInfo: {
          id: 4,
          storeName: 'OPPO Find X5 Pro',
          image: 'https://img.alicdn.com/bao/uploaded/i3/2838892713/O1CN01mtXJZ91Vub8eiWjmK_!!0-item_pic.jpg',
          price: 3999.00,
          otPrice: 4599.00,
          sales: 950,
          stock: 400,
          isShow: 1,
          isHot: 0,
          storeCategoryName: 'OPPO'
        }
      }
    ],
    pinkName: ''
  }
]

// 模拟订单统计数据
const mockOrderStats = {
  orderNum: mockOrders.length,
  storeNum: mockOrders.reduce((total, order) => total + order.cartInfo.length, 0),
  orderPrice: mockOrders.reduce((total, order) => total + order.payPrice, 0).toFixed(2),
  userNum: [...new Set(mockOrders.map(order => order.uid))].length
}

// 模拟获取订单列表
export function getOrders(params) {
  return new Promise(resolve => {
    let filteredOrders = [...mockOrders]
    
    // 根据订单状态筛选
    if (params && params.status && params.status !== '-9') {
      filteredOrders = filteredOrders.filter(order => order.status.toString() === params.status)
    }
    
    // 根据搜索条件筛选
    if (params && params.value && params.type) {
      const value = params.value.toLowerCase()
      switch(params.type) {
        case 'orderId':
          filteredOrders = filteredOrders.filter(order => order.orderId.toLowerCase().includes(value))
          break
        case 'realName':
          filteredOrders = filteredOrders.filter(order => order.realName.toLowerCase().includes(value))
          break
        case 'userPhone':
          filteredOrders = filteredOrders.filter(order => order.userPhone.includes(value))
          break
      }
    }
    
    setTimeout(() => {
      resolve({
        status: 0,
        data: {
          content: filteredOrders,
          totalElements: filteredOrders.length
        }
      })
    }, 100)
  })
}

// 模拟获取订单统计数据
export function getOrderStats() {
  return new Promise(resolve => {
    resolve({
      status: 0,
      data: mockOrderStats
    })
  })
}

export function add(data) {
  return request({
    url: 'shop/order',
    method: 'post',
    data
  })
}

export function del(id) {
  // 模拟删除订单
  return new Promise(resolve => {
    const index = mockOrders.findIndex(order => order.id === id)
    if (index !== -1) {
      mockOrders.splice(index, 1)
    }
    resolve({
      status: 0
    })
  })

  /* 原始代码
  return request({
    url: 'shop/order/' + id,
    method: 'delete'
  })
  */
}

export function edit(data) {
  // 模拟编辑订单
  return new Promise(resolve => {
    const order = mockOrders.find(order => order.id === data.id)
    if (order) {
      Object.assign(order, data)
    }
    resolve({
      status: 0
    })
  })

  /* 原始代码
  return request({
    url: 'shop/order',
    method: 'put',
    data
  })
  */
}

export function updateDelivery(data) {
  // 模拟更新物流信息
  return new Promise(resolve => {
    const order = mockOrders.find(order => order.id === data.id)
    if (order) {
      order.deliveryName = data.deliveryName
      order.deliveryId = data.deliveryId
      order.deliveryType = data.deliveryType
      order.status = 2
      order.statusName = '<b style="color:#44b549;">待收货</b>'
      order._status = 4
    }
    resolve({
      status: 0
    })
  })

  /* 原始代码
  return request({
    url: 'shop/order/updateDelivery',
    method: 'put',
    data
  })
  */
}

export function editT(data) {
  return request({
    url: 'shop/order/check',
    method: 'put',
    data
  })
}

export function refund(data) {
  // 模拟退款
  return new Promise(resolve => {
    const order = mockOrders.find(order => order.id === data.id)
    if (order) {
      order.refundStatus = 2
      order.refundPrice = order.payPrice
      order.refundReasonWapExplain = data.refundReasonWapExplain
      order.refundReasonTime = new Date().toISOString().replace('T', ' ').substr(0, 19)
      order.status = -1
      order.statusName = '<b style="color:#f124c7;">已退款</b>'
    }
    resolve({
      status: 0
    })
  })

  /* 原始代码
  return request({
    url: 'shop/order/refund',
    method: 'post',
    data
  })
  */
}

export function editOrder(data) {
  // 模拟编辑订单
  return new Promise(resolve => {
    const order = mockOrders.find(order => order.id === data.id)
    if (order) {
      Object.assign(order, data)
    }
    resolve({
      status: 0
    })
  })

  /* 原始代码
  return request({
    url: 'shop/order/edit',
    method: 'post',
    data
  })
  */
}

export function remark(data) {
  // 模拟添加备注
  return new Promise(resolve => {
    const order = mockOrders.find(order => order.id === data.id)
    if (order) {
      order.remark = data.remark
    }
    resolve({
      status: 0
    })
  })

  /* 原始代码
  return request({
    url: 'shop/order/remark',
    method: 'post',
    data
  })
  */
}

export function get() {
  // 模拟获取快递公司列表
  return new Promise(resolve => {
    resolve({
      status: 0,
      data: [
        { name: '顺丰快递', code: 'SF' },
        { name: '中通快递', code: 'ZTO' },
        { name: '圆通快递', code: 'YTO' },
        { name: '韵达快递', code: 'YD' },
        { name: '申通快递', code: 'STO' },
        { name: '邮政快递', code: 'YZPY' },
        { name: '京东物流', code: 'JD' }
      ]
    })
  })

  /* 原始代码
  return request({
    url: 'shop/express',
    method: 'get'
  })
  */
}

export function express(data) {
  // 模拟获取物流信息
  return new Promise(resolve => {
    resolve({
      status: 0,
      data: {
        deliveryName: data.deliveryName,
        deliveryId: data.deliveryId,
        list: [
          { time: '2023-01-05 18:30:15', context: '已签收，签收人：本人' },
          { time: '2023-01-05 08:25:30', context: '【派送中】快递员正在派送' },
          { time: '2023-01-04 20:15:45', context: '到达当地配送点' },
          { time: '2023-01-03 16:40:20', context: '运输中' },
          { time: '2023-01-02 10:30:00', context: '已发货' }
        ]
      }
    })
  })

  /* 原始代码
  return request({
    url: 'shop/order/express',
    method: 'post',
    data
  })
  */
}

export function getOrderDetail(id) {
  // 模拟获取订单详情
  return new Promise(resolve => {
    const order = mockOrders.find(order => order.id === Number(id)) || {}
    resolve({
      status: 0,
      data: order
    })
  })

  /* 原始代码
  return request({
    url: 'api/getStoreOrderDetail/' + id,
    method: 'get'
  })
  */
}

export function getNowOrderStatus(id) {
  // 模拟获取当前订单状态
  return new Promise(resolve => {
    const order = mockOrders.find(order => order.id === Number(id)) || {}
    resolve({
      status: 0,
      data: {
        _status: order._status,
        status: order.status,
        statusName: order.statusName
      }
    })
  })

  /* 原始代码
  return request({
    url: '/api/getNowOrderStatus/' + id,
    method: 'get'
  })
  */
}

export default { add, edit, del, updateDelivery, editT, refund, editOrder, remark, get, express, getOrderDetail, getNowOrderStatus, getOrders, getOrderStats }
