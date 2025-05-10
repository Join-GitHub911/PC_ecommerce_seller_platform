import request from '@/utils/request'

export function getMenusTree() {
  return request({
    url: 'admin/menu/listtree',
    method: 'get'
  })
}

export function buildMenus() {
  // 模拟菜单数据
  return new Promise(resolve => {
    resolve({
      status: 0,
      data: [
        {
          name: '首页',
          path: 'home',
          hidden: false,
          redirect: 'noredirect',
          component: 'Layout',
          alwaysShow: true,
          meta: {
            title: '首页',
            icon: 'index',
            noCache: true
          },
          children: [
            {
              name: '控制台',
              path: 'home',
              hidden: false,
              component: 'home/index',
              meta: {
                title: '控制台',
                icon: 'home',
                noCache: true
              }
            }
          ]
        },
        {
          name: '商城管理',
          path: '/shop',
          hidden: false,
          redirect: 'noredirect',
          component: 'Layout',
          alwaysShow: true,
          meta: {
            title: '商城管理',
            icon: 'shop',
            noCache: true
          },
          children: [
            {
              name: '商品管理',
              path: 'goods',
              hidden: false,
              component: 'shop/goods/index',
              meta: {
                title: '商品管理',
                icon: 'goods',
                noCache: true
              }
            },
            {
              name: '订单管理',
              path: 'order',
              hidden: false,
              component: 'shop/order/index',
              meta: {
                title: '订单管理',
                icon: 'order',
                noCache: true
              }
            },
            {
              name: '客户管理',
              path: 'customer',
              hidden: false,
              component: 'shop/customer/index',
              meta: {
                title: '客户管理',
                icon: 'peoples',
                noCache: true
              }
            }
          ]
        },
        {
          name: '系统管理',
          path: '/system',
          hidden: false,
          redirect: 'noredirect',
          component: 'Layout',
          alwaysShow: true,
          meta: {
            title: '系统管理',
            icon: 'system',
            noCache: true
          },
          children: [
            {
              name: '用户管理',
              path: 'user',
              hidden: false,
              component: 'system/user/index',
              meta: {
                title: '用户管理',
                icon: 'peoples',
                noCache: true
              }
            },
            {
              name: '角色管理',
              path: 'role',
              hidden: false,
              component: 'system/role/index',
              meta: {
                title: '角色管理',
                icon: 'role',
                noCache: true
              }
            },
            {
              name: '菜单管理',
              path: 'menu',
              hidden: false,
              component: 'system/menu/index',
              meta: {
                title: '菜单管理',
                icon: 'menu',
                noCache: true
              }
            }
          ]
        }
      ]
    })
  })
  
  /* 原始代码，在后端可用时恢复
  return request({
    url: 'admin/menu/build',
    method: 'get'
  })
  */
}

export function add(data) {
  return request({
    url: 'admin/menu',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'admin/menu',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'admin/menu',
    method: 'put',
    data
  })
}

export default { add, edit, del, getMenusTree }
