import React, { useEffect, useState, createContext, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Input, Badge, Avatar, Dropdown, Button, Space, Row, Col, Modal, message } from 'antd';
import { 
  ShoppingCartOutlined, 
  UserOutlined, 
  HeartOutlined, 
  HistoryOutlined,
  LogoutOutlined, 
  SettingOutlined,
  SearchOutlined,
  MenuOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { getCartCount } from '../api/cart';
import { logout } from '../api/auth';
import '../styles/Header.css'; // 添加CSS样式文件

const { Header } = Layout;
const { Search } = Input;

// 定义一个自定义事件名，用于购物车数量变化时触发
export const CART_COUNT_UPDATE_EVENT = 'cart-count-update';

// 创建一个购物车上下文，用于全局共享购物车数量
export const CartContext = createContext<{
  cartCount: number;
  updateCartCount: (count: number) => void;
}>({
  cartCount: 0,
  updateCartCount: () => {}
});

// 导出一个自定义Hook，用于在任何组件中获取和更新购物车数量
export const useCartCount = () => useContext(CartContext);

// 定义一个全局变量用于存储购物车数量
let globalCartCount = 0;

// 定义一个全局函数用于更新所有监听购物车数量的组件
const listeners: Array<(count: number) => void> = [];
export const updateGlobalCartCount = (count: number) => {
  globalCartCount = count;
  // 通知所有监听器更新数量
  listeners.forEach(listener => listener(count));
  
  // 同时触发自定义事件，兼容现有代码
  window.dispatchEvent(new Event(CART_COUNT_UPDATE_EVENT));
  
  // 将数量存储在localStorage中，用于页面刷新后恢复
  try {
    localStorage.setItem('cartCount', count?.toString() || '0');
  } catch (e) {
    console.error('Failed to save cart count to localStorage:', e);
  }
  
  console.log('全局购物车数量已更新:', count);
};

const AppHeader: React.FC = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const navigate = useNavigate();

  // 检查登录状态和用户信息
  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    const storedUserInfo = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    
    if (storedUserInfo) {
      try {
        const user = JSON.parse(storedUserInfo);
        setUserInfo(user);
        console.log('用户信息已加载:', user);
      } catch (error) {
        console.error('解析用户信息失败:', error);
      }
    } else {
      setUserInfo(null);
    }
  };

  useEffect(() => {
    // 初始检查登录状态
    checkLoginStatus();

    // 创建自定义事件监听器，监听登录状态变化
    const handleLoginStatusChange = () => {
      console.log('登录状态变化，更新用户信息');
      checkLoginStatus();
      if (localStorage.getItem('token')) {
        fetchCartCount();
      }
    };

    // 添加自定义事件监听器
    window.addEventListener('login-status-change', handleLoginStatusChange);
    
    // 定期检查登录状态变化（作为备用方案）
    const loginStatusInterval = setInterval(checkLoginStatus, 5000);

    // 如果已登录，获取购物车商品数量
    if (localStorage.getItem('token')) {
      fetchCartCount();
    }

    // 尝试从localStorage恢复购物车数量
    const savedCount = localStorage.getItem('cartCount');
    if (savedCount) {
      const count = parseInt(savedCount, 10);
      if (!isNaN(count)) {
        setCartCount(count);
        globalCartCount = count;
      }
    }

    // 检查当前设备是否为移动设备
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // 初始检查
    checkIsMobile();

    // 监听窗口大小变化，在大屏幕上隐藏移动菜单
    const handleResize = () => {
      checkIsMobile();
      if (window.innerWidth > 768) {
        setMobileMenuVisible(false);
      }
    };

    // 监听购物车数量更新事件
    const handleCartCountUpdate = () => {
      fetchCartCount();
    };

    // 注册自定义事件监听器，用于更新购物车数量
    window.addEventListener(CART_COUNT_UPDATE_EVENT, handleCartCountUpdate);
    window.addEventListener('resize', handleResize);
    
    // 添加到全局监听器列表
    const updateLocalCartCount = (count: number) => {
      setCartCount(count);
    };
    listeners.push(updateLocalCartCount);
    
    return () => {
      window.removeEventListener('login-status-change', handleLoginStatusChange);
      clearInterval(loginStatusInterval);
      window.removeEventListener(CART_COUNT_UPDATE_EVENT, handleCartCountUpdate);
      window.removeEventListener('resize', handleResize);
      
      // 从监听器列表中移除
      const index = listeners.indexOf(updateLocalCartCount);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await getCartCount();
      const count = response.data.count;
      console.log('API获取购物车数量:', count);
      
      // 如果API返回的数量与当前显示不同，则更新
      if (count !== cartCount) {
        setCartCount(count);
        
        // 更新全局购物车数量
        globalCartCount = count;
        
        // 通知其他监听器（不包括当前组件，因为已经更新了）
        // 使用setTimeout避免无限循环
        setTimeout(() => {
          listeners.forEach(listener => {
            if (listener !== setCartCount) {
              listener(count);
            }
          });
        }, 0);
        
        // 存储到localStorage
        try {
          localStorage.setItem('cartCount', count?.toString() || '0');
        } catch (e) {
          console.error('Failed to save cart count to localStorage:', e);
        }
      }
    } catch (error) {
      console.error('获取购物车数量失败:', error);
      // 如果API请求失败，尝试从localStorage获取存储的数量
      const savedCount = localStorage.getItem('cartCount');
      if (savedCount) {
        const count = parseInt(savedCount, 10);
        if (!isNaN(count)) {
          setCartCount(count);
        } else {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    }
  };

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(value.trim())}`);
    }
  };

  const handleLogout = () => {
    Modal.confirm({
      title: '确定要退出登录吗？',
      icon: <ExclamationCircleOutlined />,
      content: '退出后需要重新登录才能继续操作',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        try {
          logout();
          setIsLoggedIn(false);
          setUserInfo(null);
          setCartCount(0); // 退出登录时清空购物车数量
          message.success('已成功退出登录');
          navigate('/login');
        } catch (error) {
          console.error('退出登录失败:', error);
          message.error('退出登录失败，请稍后重试');
        }
      }
    });
  };

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/user/profile">个人中心</Link>,
      icon: <UserOutlined />
    },
    {
      key: 'orders',
      label: <Link to="/orders">我的订单</Link>,
      icon: <HistoryOutlined />
    },
    {
      key: 'favorites',
      label: <Link to="/user/favorites">我的收藏</Link>,
      icon: <HeartOutlined />
    },
    {
      key: 'settings',
      label: <Link to="/user/settings">账号设置</Link>,
      icon: <SettingOutlined />
    },
    {
      key: 'logout',
      label: <span onClick={handleLogout}>退出登录</span>,
      icon: <LogoutOutlined />
    }
  ];

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  return (
    <Header className="app-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/" style={{ color: '#1890ff' }}>电商平台</Link>
        </div>
        
        {/* 移动端菜单按钮 */}
        {isMobile && (
          <Button 
            type="text" 
            icon={<MenuOutlined />} 
            onClick={toggleMobileMenu}
            className="mobile-menu-button"
          />
        )}
        
        {/* 桌面端导航 */}
        {!isMobile && (
          <div className="desktop-nav">
            <Menu mode="horizontal" defaultSelectedKeys={['home']} style={{ border: 'none' }}>
              <Menu.Item key="home">
                <Link to="/">首页</Link>
              </Menu.Item>
              <Menu.Item key="products">
                <Link to="/products">全部商品</Link>
              </Menu.Item>
              <Menu.Item key="categories">
                <Link to="/categories">商品分类</Link>
              </Menu.Item>
              <Menu.Item key="promotions">
                <Link to="/promotions">促销活动</Link>
              </Menu.Item>
            </Menu>
            
            <Search
              placeholder="搜索商品..."
              onSearch={handleSearch}
              style={{ width: 250 }}
              enterButton={<SearchOutlined />}
            />
            
            <Space size="large">
              <Link to="/cart">
                <Badge count={cartCount} showZero>
                  <ShoppingCartOutlined style={{ fontSize: 24 }} />
                </Badge>
              </Link>
              
              {isLoggedIn ? (
                <Space>
                  <span style={{ color: '#666' }}>欢迎，{userInfo?.username}</span>
                  <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                    <Avatar 
                      src={userInfo?.avatar} 
                      icon={<UserOutlined />} 
                      style={{ cursor: 'pointer' }} 
                    />
                  </Dropdown>
                </Space>
              ) : (
                <Space>
                  <Button type="text">
                    <Link to="/login">登录</Link>
                  </Button>
                  <Button type="primary">
                    <Link to="/register">注册</Link>
                  </Button>
                </Space>
              )}
            </Space>
          </div>
        )}
        
        {/* 移动端导航菜单 */}
        {isMobile && mobileMenuVisible && (
          <div className="mobile-nav">
            <Search
              placeholder="搜索商品..."
              onSearch={handleSearch}
              style={{ width: '100%', marginBottom: '10px' }}
              enterButton={<SearchOutlined />}
            />
            
            <Menu mode="vertical" style={{ width: '100%', border: 'none' }}>
              <Menu.Item key="home">
                <Link to="/">首页</Link>
              </Menu.Item>
              <Menu.Item key="products">
                <Link to="/products">全部商品</Link>
              </Menu.Item>
              <Menu.Item key="categories">
                <Link to="/categories">商品分类</Link>
              </Menu.Item>
              <Menu.Item key="promotions">
                <Link to="/promotions">促销活动</Link>
              </Menu.Item>
              <Menu.Item key="cart">
                <Link to="/cart">购物车 ({cartCount})</Link>
              </Menu.Item>
              {isLoggedIn ? (
                <>
                  <Menu.Item key="welcome">
                    <Space>
                      <Avatar 
                        size="small" 
                        src={userInfo?.avatar} 
                        icon={<UserOutlined />} 
                      />
                      <span style={{ color: '#666' }}>欢迎，{userInfo?.username}</span>
                    </Space>
                  </Menu.Item>
                  <Menu.Item key="profile">
                    <Link to="/user/profile">个人中心</Link>
                  </Menu.Item>
                  <Menu.Item key="orders">
                    <Link to="/orders">我的订单</Link>
                  </Menu.Item>
                  <Menu.Item key="favorites">
                    <Link to="/user/favorites">我的收藏</Link>
                  </Menu.Item>
                  <Menu.Item key="settings">
                    <Link to="/user/settings">账号设置</Link>
                  </Menu.Item>
                  <Menu.Item key="logout" onClick={handleLogout}>
                    退出登录
                  </Menu.Item>
                </>
              ) : (
                <>
                  <Menu.Item key="login">
                    <Link to="/login">登录</Link>
                  </Menu.Item>
                  <Menu.Item key="register">
                    <Link to="/register">注册</Link>
                  </Menu.Item>
                </>
              )}
            </Menu>
          </div>
        )}
      </div>
    </Header>
  );
};

export default AppHeader; 