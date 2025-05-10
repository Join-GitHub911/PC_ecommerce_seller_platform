import request from '@/utils/request'

// 模拟商品数据
const mockProducts = [
  {
    id: 1,
    storeName: 'iPhone 13 Pro Max',
    image: 'https://img.alicdn.com/bao/uploaded/i1/2024216342/O1CN01iZGtGk1Vjf9vbUCOg_!!2024216342.jpg',
    price: 7999.00,
    otPrice: 8999.00,
    sales: 1000,
    stock: 500,
    isShow: 1,
    isHot: 1,
    categoryName: '手机数码',
    storeCategoryName: 'Apple',
    createTime: '2023-01-01 00:00:00',
    isPostage: 1
  },
  {
    id: 2,
    storeName: '华为 Mate 40 Pro',
    image: 'https://img.alicdn.com/bao/uploaded/i1/2539005694/O1CN01joh7pR1Tq6lYPE4rK_!!2539005694.jpg',
    price: 6999.00,
    otPrice: 7599.00,
    sales: 800,
    stock: 300,
    isShow: 1,
    isHot: 1,
    categoryName: '手机数码',
    storeCategoryName: 'Huawei',
    createTime: '2023-01-02 00:00:00',
    isPostage: 1
  },
  {
    id: 3,
    storeName: '小米 12 Pro',
    image: 'https://img.alicdn.com/bao/uploaded/i1/2549841410/O1CN01MHKdSw1OHyOghdxvG_!!0-item_pic.jpg',
    price: 4999.00,
    otPrice: 5599.00,
    sales: 1200,
    stock: 600,
    isShow: 1,
    isHot: 0,
    categoryName: '手机数码',
    storeCategoryName: 'Xiaomi',
    createTime: '2023-01-03 00:00:00',
    isPostage: 1
  }
]

// 模拟商品查询API
export function getProducts(params) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        status: 0,
        data: {
          content: mockProducts,
          totalElements: mockProducts.length
        }
      })
    }, 100)
  })
}

export function add(data) {
  // 模拟添加商品
  return new Promise(resolve => {
    const newProduct = {
      id: mockProducts.length + 1,
      ...data,
      createTime: new Date().toISOString().replace('T', ' ').substr(0, 19),
      sales: 0
    }
    mockProducts.push(newProduct)
    resolve({
      status: 0,
      data: newProduct
    })
  })

  /* 原始代码
  return request({
    url: 'shop/product/addOrSave',
    method: 'post',
    data
  })
  */
}

export function del(id) {
  // 模拟删除商品
  return new Promise(resolve => {
    const index = mockProducts.findIndex(product => product.id === id)
    if (index !== -1) {
      mockProducts.splice(index, 1)
    }
    resolve({
      status: 0
    })
  })

  /* 原始代码
  return request({
    url: 'shop/product/' + id,
    method: 'delete'
  })
  */
}

export function edit(data) {
  // 模拟编辑商品
  return new Promise(resolve => {
    const index = mockProducts.findIndex(product => product.id === data.id)
    if (index !== -1) {
      mockProducts[index] = { ...mockProducts[index], ...data }
    }
    resolve({
      status: 0
    })
  })

  /* 原始代码
  return request({
    url: 'shop/product',
    method: 'put',
    data
  })
  */
}

export function onsale(id, data) {
  // 模拟上下架
  return new Promise(resolve => {
    const product = mockProducts.find(product => product.id === id)
    if (product) {
      product.isShow = data.isShow
    }
    resolve({
      status: 0
    })
  })

  /* 原始代码
  return request({
    url: 'shop/product/onsale/' + id,
    method: 'post',
    data
  })
  */
}

export function recovery(id) {
  return request({
    url: 'shop/product/recovery/' + id,
    method: 'delete'
  })
}

export function isFormatAttr(id, data) {
  // 模拟格式属性
  return new Promise(resolve => {
    resolve({
      status: 0,
      data: true
    })
  })

  /* 原始代码
  return request({
    url: 'shop/product/isFormatAttr/' + id,
    method: 'post',
    data
  })
  */
}

export function isFormatAttrForActivity(id, data) {
  return request({
    url: 'shop/product/isFormatAttrForActivity/' + id,
    method: 'post',
    data
  })
}

export function setAttr(id, data) {
  // 模拟设置属性
  return new Promise(resolve => {
    resolve({
      status: 0
    })
  })

  /* 原始代码
  return request({
    url: 'shop/product/setAttr/' + id,
    method: 'post',
    data
  })
  */
}

export function clearAttr(id) {
  return request({
    url: 'shop/product/clearAttr/' + id,
    method: 'post'
  })
}

export function getAttr(id) {
  // 模拟获取属性
  return new Promise(resolve => {
    resolve({
      status: 0,
      data: {
        attr: [],
        value: []
      }
    })
  })

  /* 原始代码
  return request({
    url: 'shop/product/attr/' + id,
    method: 'get'
  })
  */
}

export function getInfo(id) {
  // 模拟获取商品信息
  return new Promise(resolve => {
    const product = mockProducts.find(product => product.id === Number(id)) || {}
    resolve({
      status: 0,
      data: product
    })
  })

  /* 原始代码
  return request({
    url: 'shop/product/info/' + id,
    method: 'get'
  })
  */
}

export default { add, edit, del, onsale, recovery, isFormatAttr, isFormatAttrForActivity, setAttr, clearAttr, getAttr, getInfo, getProducts }
