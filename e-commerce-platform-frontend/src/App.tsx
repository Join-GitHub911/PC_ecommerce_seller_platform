import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import './App.css'
import MainLayout from './layouts/MainLayout'
import BlankLayout from './layouts/BlankLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import UserProfile from './pages/UserProfile'
import NotFound from './pages/NotFound'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import RegionSelector from './pages/RegionSelector'
import OrderList from './pages/OrderList'
import OrderDetail from './pages/OrderDetail'
import Payment from './pages/Payment'
import Logistics from './pages/Logistics'
import AfterSale from './pages/AfterSale'
import CustomerService from './pages/CustomerService'

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          {/* 无头尾的布局 - 用于登录和注册页 */}
          <Route element={<BlankLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          
          {/* 带头尾的主布局 - 用于其他所有页面 */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/region-selector" element={<RegionSelector />} />
            
            {/* 订单相关路由 */}
            <Route path="/orders" element={<OrderList />} />
            <Route path="/order/:orderId" element={<OrderDetail />} />
            <Route path="/payment/:orderId" element={<Payment />} />
            
            {/* 订单路由重定向，保证所有订单链接都指向同一个组件 */}
            <Route path="/user/orders" element={<Navigate to="/orders" replace />} />
            <Route path="/order/list" element={<Navigate to="/orders" replace />} />
            
            {/* 物流与售后相关路由 */}
            <Route path="/logistics/:orderId" element={<Logistics />} />
            <Route path="/after-sale/:orderId" element={<AfterSale />} />
            <Route path="/customer-service" element={<CustomerService />} />
            
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
