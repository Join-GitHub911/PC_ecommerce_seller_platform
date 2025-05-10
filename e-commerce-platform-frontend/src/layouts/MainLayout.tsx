import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { CartContext, updateGlobalCartCount } from '../components/Header';
import { getCartCount } from '../api/cart';

const MainLayout: React.FC = () => {
  // 在布局中初始化并提供全局购物车状态
  const [cartCount, setCartCount] = React.useState(0);

  useEffect(() => {
    // 尝试从localStorage恢复购物车数量
    const savedCount = localStorage.getItem('cartCount');
    if (savedCount) {
      const count = parseInt(savedCount, 10);
      if (!isNaN(count)) {
        setCartCount(count);
      }
    }

    // 加载时获取一次购物车数量
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await getCartCount();
          const count = response.data.count;
          setCartCount(count);
          updateGlobalCartCount(count);
        }
      } catch (error) {
        console.error('获取购物车数量失败:', error);
      }
    };

    fetchCartCount();

    // 监听购物车数量更新事件
    const handleCartCountUpdate = () => {
      const newCount = localStorage.getItem('cartCount');
      if (newCount) {
        const count = parseInt(newCount, 10);
        if (!isNaN(count)) {
          setCartCount(count);
        }
      }
    };

    window.addEventListener('cart-count-update', handleCartCountUpdate);
    
    return () => {
      window.removeEventListener('cart-count-update', handleCartCountUpdate);
    };
  }, []);

  // 提供更新购物车数量的函数
  const updateCartCount = (count: number) => {
    setCartCount(count);
    updateGlobalCartCount(count);
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      <div className="main-layout">
        <main>
          <Outlet />
        </main>
      </div>
    </CartContext.Provider>
  );
};

export default MainLayout;
