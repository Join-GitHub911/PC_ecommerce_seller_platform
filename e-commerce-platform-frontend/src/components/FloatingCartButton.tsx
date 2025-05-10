import React, { useState, useEffect } from 'react';
import { Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { getCartCount } from '../api/cart';
import './FloatingCartButton.css';

// 导入事件名和购物车Context
import { CART_COUNT_UPDATE_EVENT, useCartCount } from '../components/Header';

interface FloatingCartButtonProps {
  onClick: () => void;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ onClick }) => {
  const [cartCount, setCartCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { cartCount: globalCartCount } = useCartCount();

  // 初始加载购物车数量
  useEffect(() => {
    // 从全局状态获取购物车数量
    setCartCount(globalCartCount);
    
    // 首次加载也尝试获取一次最新数据
    fetchCartCount();
    
    // 监听购物车更新事件
    window.addEventListener(CART_COUNT_UPDATE_EVENT, fetchCartCount);
    
    // 监听滚动显示/隐藏按钮
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener(CART_COUNT_UPDATE_EVENT, fetchCartCount);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // 监听全局购物车数量变化
  useEffect(() => {
    setCartCount(globalCartCount);
  }, [globalCartCount]);

  // 获取购物车数量
  const fetchCartCount = async () => {
    try {
      const response = await getCartCount();
      if (response && response.data && response.data.count !== undefined) {
        // 只有当数量不同时才更新，避免不必要的渲染
        if (response.data.count !== cartCount) {
          setCartCount(response.data.count);
        }
      }
    } catch (error) {
      console.error('获取购物车数量失败:', error);
      // 如果API请求失败，尝试从localStorage获取购物车数量
      const savedCount = localStorage.getItem('cartCount');
      if (savedCount) {
        const count = parseInt(savedCount, 10);
        if (!isNaN(count) && count !== cartCount) {
          setCartCount(count);
        }
      }
    }
  };
  
  // 处理滚动事件，滚动超过300px显示按钮
  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setIsVisible(scrollTop > 300);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="floating-cart-button" onClick={onClick}>
      <ShoppingCartOutlined style={{ fontSize: 24 }} />
      {cartCount > 0 && (
        <Badge count={cartCount} className="cart-count" />
      )}
    </div>
  );
};

export default FloatingCartButton; 