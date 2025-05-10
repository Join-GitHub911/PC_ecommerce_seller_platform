// 模拟订单数据
export const mockOrders = [
  {
    id: 'order1',
    orderNumber: 'YH20230001',
    userId: 'user1',
    status: 'pending_payment',
    totalAmount: 5288,
    subtotal: 5288,
    shippingFee: 0,
    discount: 0,
    finalAmount: 5288,
    paymentMethod: 'alipay',
    addressId: 'addr1',
    address: {
      name: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园南区8栋101室',
      isDefault: true
    },
    items: [
      {
        id: 'item1',
        productId: 'p3',
        productName: 'Apple/iPhone 6s Plus全网通手机正品学生老人机备用6s苹果手机',
        productImage: '/src/assets/iPhone6s玫瑰金.png',
        price: 5288,
        quantity: 1,
        specifications: {
          "颜色": "玫瑰金色",
          "存储容量": "64GB",
          "网络类型": "全网通"
        },
        status: 'normal'
      }
    ],
    createdAt: '2023-07-15T08:30:00.000Z',
    updatedAt: '2023-07-15T08:30:00.000Z'
  },
  {
    id: 'order2',
    orderNumber: 'YH20230002',
    userId: 'user1',
    status: 'paid',
    totalAmount: 648,
    subtotal: 648,
    shippingFee: 0,
    discount: 0,
    finalAmount: 648,
    paymentMethod: 'wechat',
    addressId: 'addr1',
    address: {
      name: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园南区8栋101室',
      isDefault: true
    },
    items: [
      {
        id: 'item2',
        productId: 'p1',
        productName: '凡茜白茶毛孔细致卸妆油200ml官方旗舰店正品卸妆女',
        productImage: '/src/assets/product1-1.png',
        price: 53,
        quantity: 2,
        specifications: {
          "规格": "200ml正装",
          "功效": "深层清洁型"
        },
        status: 'normal'
      },
      {
        id: 'item3',
        productId: 'p2',
        productName: '德国原装进口德亚原味酸奶纯牛奶制作200ml*24盒整箱',
        productImage: '/src/assets/德亚酸奶1.png',
        price: 189,
        quantity: 1,
        specifications: {
          "规格": "200ml*24盒",
          "口味": "原味"
        },
        status: 'normal'
      },
      {
        id: 'item4',
        productId: 'p4',
        productName: '倩碧(Clinique)保湿修护水乳套装（黄油125ml+粉水200ml）干皮补水护肤品礼盒',
        productImage: '/src/assets/倩碧1.png',
        price: 368,
        quantity: 1,
        specifications: {
          "套装类型": "基础护肤套装(黄油+粉水)",
          "适用肤质": "干性肌肤"
        },
        status: 'normal'
      }
    ],
    refunds: [],
    createdAt: '2023-07-20T14:20:00.000Z',
    updatedAt: '2023-07-20T14:25:00.000Z',
    payTime: '2023-07-20T14:25:00.000Z'
  },
  {
    id: 'order3',
    orderNumber: 'YH20230003',
    userId: 'user1',
    status: 'shipping',
    totalAmount: 280,
    subtotal: 280,
    shippingFee: 0,
    discount: 0,
    finalAmount: 280,
    paymentMethod: 'alipay',
    addressId: 'addr1',
    address: {
      name: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园南区8栋101室',
      isDefault: true
    },
    items: [
      {
        id: 'item5',
        productId: 'p5',
        productName: '西班牙原装进口MUELOLIVA品利特级初榨橄榄油750ml',
        productImage: '/src/assets/品利1.png',
        price: 280,
        quantity: 1,
        specifications: {
          "规格": "750ml单瓶",
          "产地": "西班牙",
          "种类": "特级初榨"
        },
        status: 'normal'
      }
    ],
    refunds: [
      {
        id: 'refund2',
        orderId: 'order3',
        status: 'pending',
        amount: 280,
        reason: '快递延迟',
        description: '商品一直未收到，订单已显示发货一周',
        createdAt: '2023-08-13T10:30:00.000Z',
        updatedAt: '2023-08-13T10:30:00.000Z',
        images: []
      }
    ],
    createdAt: '2023-08-05T10:10:00.000Z',
    updatedAt: '2023-08-05T10:20:00.000Z',
    payTime: '2023-08-05T10:20:00.000Z',
    shipTime: '2023-08-06T09:30:00.000Z',
    trackingNumber: 'SF1234567890',
    trackingCompany: '顺丰速运'
  },
  {
    id: 'order4',
    orderNumber: 'YH20230004',
    userId: 'user1',
    status: 'completed',
    totalAmount: 368,
    subtotal: 368,
    shippingFee: 0,
    discount: 0,
    finalAmount: 368,
    paymentMethod: 'wechat',
    addressId: 'addr1',
    address: {
      name: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园南区8栋101室',
      isDefault: true
    },
    items: [
      {
        id: 'item6',
        productId: 'p4',
        productName: '倩碧(Clinique)保湿修护水乳套装（黄油125ml+粉水200ml）干皮补水护肤品礼盒',
        productImage: '/src/assets/倩碧1.png',
        price: 368,
        quantity: 1,
        specifications: {
          "套装类型": "基础护肤套装(黄油+粉水)",
          "适用肤质": "干性肌肤"
        },
        status: 'normal'
      }
    ],
    refunds: [
      {
        id: 'refund1',
        orderId: 'order4',
        status: 'completed',
        amount: 368,
        reason: '质量问题',
        description: '产品使用后过敏',
        createdAt: '2023-08-26T09:30:00.000Z',
        updatedAt: '2023-08-27T10:20:00.000Z',
        completedAt: '2023-08-27T10:20:00.000Z',
        images: []
      }
    ],
    createdAt: '2023-08-15T16:45:00.000Z',
    updatedAt: '2023-08-25T10:20:00.000Z',
    payTime: '2023-08-15T16:50:00.000Z',
    shipTime: '2023-08-16T09:30:00.000Z',
    deliveredTime: '2023-08-18T14:20:00.000Z',
    completedTime: '2023-08-25T10:20:00.000Z',
    trackingNumber: 'YT9876543210',
    trackingCompany: '圆通速递'
  },
  {
    id: 'order5',
    orderNumber: 'YH20230005',
    userId: 'user1',
    status: 'cancelled',
    totalAmount: 189,
    subtotal: 189,
    shippingFee: 0,
    discount: 0,
    finalAmount: 189,
    paymentMethod: null,
    addressId: 'addr1',
    address: {
      name: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园南区8栋101室',
      isDefault: true
    },
    items: [
      {
        id: 'item7',
        productId: 'p2',
        productName: '德国原装进口德亚原味酸奶纯牛奶制作200ml*24盒整箱',
        productImage: '/src/assets/德亚酸奶1.png',
        price: 189,
        quantity: 1,
        specifications: {
          "规格": "200ml*24盒",
          "口味": "原味"
        },
        status: 'normal'
      }
    ],
    createdAt: '2023-09-01T08:30:00.000Z',
    updatedAt: '2023-09-01T09:15:00.000Z',
    cancelReason: '购买错误，重新下单',
    cancelTime: '2023-09-01T09:15:00.000Z'
  }
];

// 获取模拟订单数据
export const getMockOrders = (params: any = {}) => {
  let filteredOrders = [...mockOrders];
  
  // 根据状态过滤
  if (params.status && params.status !== 'all') {
    filteredOrders = filteredOrders.filter(order => order.status === params.status);
  }
  
  return {
    data: filteredOrders,
    total: filteredOrders.length,
    page: 1,
    pageSize: 10
  };
}; 